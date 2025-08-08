import { Router } from "express";
import { isAuthenticated, isHR } from "../validators/auth.validator.js";
import Candidate from "../models/Candidate.js";
import Interview from "../models/Interview.js";
import mongoose from "mongoose";
import multer from 'multer';
import { uploadFileLocally } from '../utils/fileUploadService.js';
import { processAiAnalysis } from '../utils/aiAnalysisService.js';
import nodemailer from 'nodemailer';

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
                    // Pastikan fungsi uploadFileLocally menerima buffer dan nama file
                    recordingUrl = await uploadFileLocally(recordingFile.buffer, uniqueFileName);
                } catch (uploadError) {
                    console.error("Error during file re-upload:", uploadError);
                    return res.status(500).json({ message: "Failed to upload new interview recording.", error: uploadError.message });
                }

                const latestInterview = await Interview.findOne({ candidateId: id, userId: userId }).sort({ createdAt: -1 });

                if (latestInterview) {
                    latestInterview.interviewType = interviewType || latestInterview.interviewType;
                    latestInterview.recordingUrl = recordingUrl;
                    latestInterview.recordingType = recordingFile.mimetype.startsWith('video') ? 'video' : 'audio';
                    latestInterview.processStatus = 'Analyzing'; // Set status kembali ke Analyzing untuk diproses ulang
                    latestInterview.overallAiScore = null;
                    latestInterview.overallAiFeedback = null;
                    latestInterview.aiScores = null;
                    latestInterview.hrFeedbackProvided = false;
                    await latestInterview.save();
                    processAiAnalysis(latestInterview._id); // Trigger analysis for the updated interview
                } else {
                    const newInterview = await Interview.create({
                        userId,
                        candidateId: candidate._id,
                        interviewType: interviewType || 'unknown',
                        recordingUrl,
                        recordingType: recordingFile.mimetype.startsWith('video') ? 'video' : 'audio',
                        processStatus: 'Analyzing',
                    });
                    candidate.interviews.push(newInterview._id);
                    processAiAnalysis(newInterview._id);
                }
            }

            // Memperbarui status feedback kandidat ke 'Need Review' jika ada pembaruan wawancara.
            // Ini akan memastikan penghitungan 'Need Review' di dashboard kembali akurat.
            if (recordingFile) {
                candidate.sendFeedbackStatus = 'Need Review';
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
        const totalInterviews = await Interview.countDocuments({ userId: userId });

        // Menghitung kandidat yang sudah memiliki feedback AI/HR
        const totalResponses = await Interview.countDocuments({ 
            userId: userId, 
            $or: [
                { overallAiFeedback: { $exists: true, $ne: null } },
                { hrRating: { $exists: true, $ne: null, $ne: 0 } }
            ]
        });

        // Correctly count interviews that need review using the 'hrFeedbackProvided' field
        const needReview = await Interview.countDocuments({ 
            userId: userId, 
            hrFeedbackProvided: false
        });

        res.json({
            totalApplicants,
            totalInterviews,
            totalResponses,
            needReview 
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        next(error);
    }
});

// @route GET /api/dashboard/candidates
// @desc Get list of candidates with their latest interview details for the dashboard table
// @access Private (HR only)
router.get('/candidates', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Tambahkan parameter filter ke destructuring req.query
        const { keyword, page = 1, pageSize = 5, sortBy = 'appliedDate', sortOrder = 'desc', status, feedback, startDate, endDate } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        // 2. Buat objek matchStage untuk query awal
        const matchStage = { createdBy: new mongoose.Types.ObjectId(userId) };

        if (keyword) {
            matchStage.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { position: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, '$options': 'i' } }
            ];
        }

        if (startDate && endDate) {
            matchStage.appliedDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const totalCandidates = await Candidate.countDocuments(matchStage);

        const candidates = await Candidate.aggregate([
            { $match: matchStage },
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
                                cond: { $ne: ["$$interview.processStatus", "Uploaded"] }
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
                    // THIS IS THE PART YOU NEED TO CORRECT
                    status: {
                        $cond: {
                            if: "$latestInterview.hrFeedbackProvided", // Check the boolean value directly
                            then: "Reviewed",
                            else: "Unreviewed"
                        }
                    },
                    aiScore: { $ifNull: ["$latestInterview.overallAiScore", null] },
                    hrRating: { $ifNull: ["$latestInterview.hrRating", null] },
                    // THIS IS THE PART YOU NEED TO CORRECT
                    sendFeedbackStatus: {
                        $cond: {
                            if: "$latestInterview.emailSent", // Check the boolean value directly
                            then: "Sent",
                            else: "Need Review"
                        }
                    },
                }
            },
            // 3. Tambahkan tahap $match untuk memfilter berdasarkan status dan feedback
            {
                $match: {
                    ...(status && { 'status': status }),
                    ...(feedback && { 'sendFeedbackStatus': feedback })
                }
            },
            { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
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


// Endpoint for fetching a single interview
router.get('/interviews/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ _id: interviewId, userId: userId }).populate('candidateId');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or you do not have permission to view.' });
        }

        res.json(interview);
    } catch (error) {
        console.error('Error fetching single interview:', error);
        next(error);
    }
});

// Endpoint to re-run AI analysis
router.post('/interviews/reprocess/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ _id: interviewId, userId: userId });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found.' });
        }

        // Reset AI analysis fields and status
        interview.processStatus = 'Analyzing';
        interview.overallAiScore = null;
        interview.overallAiFeedback = null;
        interview.aiScores = null;
        await interview.save();

        // Trigger the analysis process again
        processAiAnalysis(interviewId);

        res.status(200).json({ message: 'AI analysis successfully re-initiated.' });

    } catch (error) {
        console.error('Error reprocessing interview:', error);
        next(error);
    }
});

router.put(
    '/interviews/:interviewId/feedback',
    isAuthenticated,
    isHR,
    async (req, res, next) => {
        try {
            const { interviewId } = req.params;
            const { hrRating, hrFeedback, hrRatings } = req.body;
            const userId = req.user._id;

            // Find the interview by its ID
            const interview = await Interview.findOne({ candidateId: interviewId, userId: userId });

            if (!interview) {
                return res.status(404).json({ message: 'Interview not found.' });
            }

            // Update the interview document
            interview.hrRating = hrRating;
            interview.hrNotes = hrFeedback;
            interview.hrRatings = hrRatings;
            interview.hrFeedbackProvided = true;
            interview.status = "Reviewed"; 

            await interview.save();
            
            res.status(200).json({
                message: "Feedback saved successfully.",
                interview,
            });
        } catch (err) {
            console.error('Error saving HR feedback:', err);
            next(err);
        }
    }
);

router.post(
    '/interviews/:interviewId/send-email',
    isAuthenticated,
    isHR,
    async (req, res, next) => {
        try {
            const { interviewId } = req.params;
            const { hrFeedback } = req.body;
            const userId = req.user._id;

            // Find the interview by its ID and populate the candidate data
            const interview = await Interview.findOne({ candidateId: interviewId, userId: userId }).populate('candidateId');
            
            if (!interview) {
                return res.status(404).json({ message: 'Interview not found.' });
            }
            if (!interview.candidateId) {
                return res.status(404).json({ message: 'Candidate not found.' });
            }

            // Update the interview's status and feedback before sending the email
            interview.hrNotes = hrFeedback;
            interview.hrFeedbackProvided = true;
            interview.emailSent = true;
            interview.status = "Reviewed";
            await interview.save();

            // Email sending logic
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.GOOGLE_APP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: interview.candidateId.email,
                subject: `Feedback for your application for the ${interview.candidateId.position} position`,
                html: `
                    <h2>Dear ${interview.candidateId.name},</h2>
                    <p>Thank you for your interest in the ${interview.candidateId.position} position. We have reviewed your interview and would like to provide some feedback.</p>
                    <p><strong>HR Note:</strong></p>
                    <p>${hrFeedback}</p>
                    <p><strong>HR Rating:</strong> ${interview.hrRating}</p>
                    <p>We appreciate your time and effort. We will be in touch with you regarding the next steps.</p>
                    <p>Best regards,<br>The HR Team</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Feedback email sent to ${interview.candidateId.email}.`);

            res.status(200).json({ message: 'Feedback email sent successfully.' });
        } catch (err) {
            console.error('Error sending feedback email:', err);
            next(err);
        }
    }
);

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

            const newInterview = await Interview.create({
                userId,
                candidateId: newCandidate._id,
                interviewType,
                recordingUrl,
                recordingType: recordingFile.mimetype.startsWith('video') ? 'video' : 'audio',
                processStatus: 'Analyzing', // Set status to 'Analyzing'
                // Remove the dummy values here. Let the AI service populate them.
            });

            newCandidate = await Candidate.findByIdAndUpdate(
                newCandidate._id,
                { $push: { interviews: newInterview._id } },
                { new: true }
            );

            // Trigger the AI analysis without waiting for the result
            processAiAnalysis(newInterview._id);

            console.log(`Candidate ${newCandidate.name} added and interview ${newInterview._id} uploaded locally. Analysis initiated.`);

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
        //     const interview = await Interview.findById(interviewId);
        //     if (interview && interview.recordingUrl) {
        //         const fileName = path.basename(interview.recordingUrl); // Ambil nama file dari URL
        //         const filePath = path.join(uploadsDir, fileName);
        //         if (fs.existsSync(filePath)) {
        //             fs.unlinkSync(filePath); // Hapus file
        //             console.log(`Deleted file: ${filePath}`);
        //         }
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


// Endpoint for fetching a single interview
router.get('/interviews/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ _id: interviewId, userId: userId }).populate('candidateId');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or you do not have permission to view.' });
        }

        res.json(interview);
    } catch (error) {
        console.error('Error fetching single interview:', error);
        next(error);
    }
});

// Endpoint to re-run AI analysis
router.post('/interviews/reprocess/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ _id: interviewId, userId: userId });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found.' });
        }

        // Reset AI analysis fields and status
        interview.processStatus = 'Analyzing';
        interview.overallAiScore = null;
        interview.overallAiFeedback = null;
        interview.aiScores = null;
        await interview.save();

        // Trigger the analysis process again
        processAiAnalysis(interviewId);

        res.status(200).json({ message: 'AI analysis successfully re-initiated.' });

    } catch (error) {
        console.error('Error reprocessing interview:', error);
        next(error);
    }
});


export default router;