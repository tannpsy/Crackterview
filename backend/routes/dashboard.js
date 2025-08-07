// Backend/routes/dashboard.js
import { Router } from "express";
import { isAuthenticated, isHR } from "../validators/auth.validator.js";
import Candidate from "../models/Candidate.js";
import Interview from "../models/Interview.js";
import mongoose from "mongoose"; 
import multer from 'multer';
import { uploadFileLocally } from '../utils/fileUploadService.js';

const router = Router();

// Konfigurasi Multer
const upload = multer({
    storage: multer.memoryStorage(), // Menyimpan file di memori sebagai buffer
    limits: { fileSize: 50 * 1024 * 1024 } // Batas ukuran file 50 MB
});

// @route PUT /api/dashboard/candidates/:id
// @desc Update an existing candidate and optionally their interview recording
// @access Private (HR only)
router.put(
  '/candidates/:id',
  isAuthenticated,
  isHR,
  upload.single('recording'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { name, email, position, interviewType, phoneNumber } = req.body;
      const recordingFile = req.file;

      const candidate = await Candidate.findOne({ _id: id, createdBy: userId });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found or you do not have permission to edit." });
      }

      // Perbarui data kandidat
      candidate.name = name || candidate.name;
      candidate.email = email || candidate.email;
      candidate.position = position || candidate.position;
      candidate.phoneNumber = phoneNumber || candidate.phoneNumber;
      
      // Jika ada file baru diunggah, perbarui data interview juga
      if (recordingFile) {
        const uniqueFileName = `${Date.now()}-${recordingFile.originalname.replace(/\s/g, '_')}`;
        let recordingUrl;
        
        try {
          recordingUrl = await uploadFileLocally(recordingFile.buffer, uniqueFileName);
        } catch (uploadError) {
          console.error("Error during file re-upload:", uploadError);
          return res.status(500).json({ message: "Failed to upload new interview recording.", error: uploadError.message });
        }
        
        // Asumsi kandidat hanya memiliki satu interview atau kita ingin update yang terakhir
        const latestInterview = await Interview.findOne({ candidateId: id, userId: userId }).sort({ createdAt: -1 });

        if (latestInterview) {
          
          latestInterview.interviewType = interviewType || latestInterview.interviewType;
          latestInterview.recordingUrl = recordingUrl;
          latestInterview.recordingType = recordingFile.mimetype.startsWith('video') ? 'video' : 'audio';
          latestInterview.processStatus = 'Uploaded'; // Set status kembali ke Uploaded untuk diproses ulang
          
          await latestInterview.save();
        } else {
          const newInterview = await Interview.create({
            userId,
            candidateId: candidate._id,
            interviewType: interviewType || 'unknown',
            recordingUrl,
            recordingType: recordingFile.mimetype.startsWith('video') ? 'video' : 'audio',
            processStatus: 'Uploaded',
          });
          candidate.interviews.push(newInterview._id);
        }
      }
      
      await candidate.save();

      res.json({
        message: "Candidate and interview details updated successfully.",
        candidate,
      });

    } catch (error) {
      console.error("Error updating candidate:", error);
      next(error);
    }
  }
);

// @route GET /api/dashboard/stats
// @desc Get dashboard statistics (Total Applicants, Total Interviews, Total Responses, Need Response)
// @access Private (HR only)
router.get('/stats', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const userId = req.user._id;

        const totalApplicants = await Candidate.countDocuments({ createdBy: userId });

        const totalInterviews = await Interview.countDocuments({
            userId: userId,
            processStatus: { $in: ['Uploaded', 'Analyzing', 'Analysis Complete', 'HR Reviewed'] }
        });

        const totalResponses = await Interview.countDocuments({
            userId: userId,
            processStatus: 'HR Reviewed', 
            hrFeedbackProvided: true
        });

        const needResponse = await Interview.countDocuments({
            userId: userId,
            processStatus: 'Analysis Complete',
            hrFeedbackProvided: false
        });

        res.json({
            totalApplicants,
            totalInterviews,
            totalResponses,
            needResponse
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        next(error);
    }
});

// @route GET /api/dashboard/candidates
// @desc Get list of candidates with their latest interview details for the dashboard table
// @access Private (HR only)
router.get('/candidates', isAuthenticated, isHR, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { keyword, page = 1, pageSize = 10, sortBy = 'appliedDate', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const query = { createdBy: userId };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { position: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ];
    }

    const totalCandidates = await Candidate.countDocuments(query);

    const candidates = await Candidate.aggregate([
      { $match: query },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'interviews',
          localField: 'interviews',
          foreignField: '_id',
          as: 'interviewDetails'
        }
      },
      {
        $addFields: {
          latestInterview: {
            $last: {
              $filter: {
                input: "$interviewDetails",
                as: "interview",
                cond: { $in: ["$$interview.processStatus", ['Analysis Complete', 'HR Reviewed']] }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          position: 1,
          appliedDate: 1,
          interviewId: "$latestInterview._id", 
          status: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$latestInterview", null] },
                  "$latestInterview.hrFeedbackProvided"
                ]
              },
              then: "Reviewed",
              else: "Unreviewed"
            }
          },
          aiScore: { $ifNull: ["$latestInterview.overallAiScore", null] },
          hrRating: { $ifNull: ["$latestInterview.hrRating", null] },
          sendFeedbackStatus: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$latestInterview", null] },
                  "$latestInterview.hrFeedbackProvided"
                ]
              },
              then: "Sent",
              else: "Need Review"
            }
          }
        }
      }
    ]);

    res.json({
      data: candidates,
      total: totalCandidates,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error("Error fetching candidates for dashboard:", error);
    next(error);
  }
});


// @route POST /api/dashboard/candidates
// @desc Add a new candidate AND upload their interview recording (menggunakan penyimpanan lokal)
// @access Private (HR only)
router.post(
    '/candidates',
    isAuthenticated,
    isHR,
    upload.single('recording'),
    async (req, res, next) => {
        try {
            const { name, email, position, interviewType } = req.body;
            const recordingFile = req.file;
            const userId = req.user._id;

            // Validasi input
            if (!name || !email || !position || !interviewType) {
                return res.status(400).json({ message: "Name, email, position, and interviewType are required for new candidate and interview." });
            }
            if (!recordingFile) {
                return res.status(400).json({ message: "Interview recording file is required." });
            }
            const supportedMimetypes = ['audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm', 'audio/ogg', 'video/ogg'];
            if (!supportedMimetypes.includes(recordingFile.mimetype)) {
                return res.status(400).json({ message: `Unsupported recording file type. Only ${supportedMimetypes.join(', ')} are allowed.` });
            }

            const candidateExists = await Candidate.findOne({ email });
            if (candidateExists) {
                return res.status(400).json({ message: "Candidate with this email already exists." });
            }

            const uniqueFileName = `${Date.now()}-${recordingFile.originalname.replace(/\s/g, '_')}`;
            let recordingUrl;
            try {
                recordingUrl = await uploadFileLocally(recordingFile.buffer, uniqueFileName);
            } catch (uploadError) {
                console.error("Error during file upload:", uploadError);
                return res.status(500).json({ message: "Failed to upload interview recording.", error: uploadError.message });
            }

            let newCandidate = await Candidate.create({
                name,
                email,
                position,
                createdBy: userId,
                applicationStatus: 'Interviewed'
            });

            const dummyAiScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60; 
            const dummyAiFeedback = "Initial AI analysis pending, but candidate profile looks promising.";

            const newInterview = await Interview.create({
                userId,
                candidateId: newCandidate._id,
                interviewType,
                recordingUrl,
                recordingType: recordingFile.mimetype.startsWith('video') ? 'video' : 'audio',
                processStatus: 'Uploaded',
                overallAiScore: dummyAiScore,      
                overallAiFeedback: dummyAiFeedback 
            });

            newCandidate = await Candidate.findByIdAndUpdate(
                newCandidate._id,
                { $push: { interviews: newInterview._id } },
                { new: true } // Mengembalikan dokumen yang sudah diperbarui
            );

            console.log(`Candidate ${newCandidate.name} added and interview ${newInterview._id} uploaded locally. Analysis will proceed shortly.`);

            res.status(201).json({
                message: "Candidate added and interview uploaded successfully. Analysis will proceed shortly.",
                candidate: newCandidate,
                interview: newInterview
            });

        } catch (error) {
            console.error("Error adding new candidate with interview:", error);
            next(error);
        }
    }
);


// @route PUT /api/dashboard/candidates/:candidateId/interviews/:interviewId/review-status
// @desc Update HR review status for a specific interview of a candidate
// @access Private (HR only)
router.put(
  '/candidates/:candidateId/interviews/:interviewId/review-status',
  isAuthenticated,
  isHR,
  async (req, res, next) => {
    try {
      const { candidateId, interviewId } = req.params;
      const {
        hrRating: bodyHrRating,
        hrNotes: bodyHrNotes,
        hrFeedbackProvided: bodyHrFeedbackProvided
      } = req.body;

      const {
        hrRating: queryHrRating,
        hrNotes: queryHrNotes,
        hrFeedbackProvided: queryHrFeedbackProvided
      } = req.query;

      const hrRating = bodyHrRating ?? queryHrRating;
      const hrNotes = bodyHrNotes ?? queryHrNotes;
      const hrFeedbackProvided = bodyHrFeedbackProvided ?? queryHrFeedbackProvided;

      const userId = req.user._id;

      // Validate rating
      const parsedHrRating = parseFloat(hrRating);
      if (
        hrRating !== undefined &&
        (isNaN(parsedHrRating) || parsedHrRating < 0 || parsedHrRating > 5)
      ) {
        return res
          .status(400)
          .json({ message: "HR Rating must be a number between 0 and 5." });
      }

      const interview = await Interview.findOne({
        _id: interviewId,
        candidateId,
        userId,
      });

      if (!interview) {
        return res
          .status(404)
          .json({ message: "Interview not found for this candidate." });
      }

      // Apply updates
      if (hrRating !== undefined) interview.hrRating = parsedHrRating;
      if (hrNotes !== undefined) interview.hrNotes = hrNotes;
      if (hrFeedbackProvided !== undefined) {
        interview.hrFeedbackProvided =
          hrFeedbackProvided === "true" || hrFeedbackProvided === true;
        interview.processStatus = interview.hrFeedbackProvided
          ? "HR Reviewed"
          : "Analysis Complete";
      }

      await interview.save();

      // Update candidate hrRating
      if (hrRating !== undefined) {
        await Candidate.findByIdAndUpdate(candidateId, {
          $set: { hrRating: parsedHrRating },
        });
      }

      const populatedInterview = await interview.populate("candidateId");
      res.json({
        message: "Interview review status updated successfully.",
        interview: populatedInterview,
      });
    } catch (error) {
      console.error("Error updating interview review status:", error);
      next(error);
    }
  }
);


// Endpoint untuk menghapus kandidat dan interview-nya
router.delete('/candidates/:candidateId', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { candidateId } = req.params;
        const userId = req.user._id;

        const candidate = await Candidate.findOneAndDelete({ _id: candidateId, createdBy: userId });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found or you don't have access." });
        }

        await Interview.deleteMany({ candidateId: candidate._id, userId: userId });
        // TODO: Hapus file rekaman dari penyimpanan lokal yang terkait dengan interview ini (Implementasi File System)
        // const uploadsDir = path.join(__dirname, '../../public/uploads'); // Path ke folder upload
        // for (const interviewId of candidate.interviews) {
        //     const interview = await Interview.findById(interviewId);
        //     if (interview && interview.recordingUrl) {
        //         const fileName = path.basename(interview.recordingUrl); // Ambil nama file dari URL
        //         const filePath = path.join(uploadsDir, fileName);
        //         if (fs.existsSync(filePath)) {
        //             fs.unlinkSync(filePath); // Hapus file
        //             console.log(`Deleted file: ${filePath}`);
        //         }
        //     }
        // }


        res.status(204).send();

    } catch (error) {
        console.error("Error deleting candidate:", error);
        next(error);
    }
});


// Endpoint untuk mendapatkan semua sesi wawancara untuk kandidat tertentu
router.get('/candidates/:candidateId/interviews', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { candidateId } = req.params;
        const userId = req.user._id;

        const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found or you don't have access." });
        }

        const interviews = await Interview.find({ candidateId: candidateId, userId: userId }).sort({ createdAt: -1 });

        res.json(interviews);
    } catch (error) {
        console.error("Error fetching candidate interviews:", error);
        next(error);
    }
});


export default router;