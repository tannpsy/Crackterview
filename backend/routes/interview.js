// Backend/routes/interview.js (Revisi Minor)
import { Router } from "express";
import Interview from "../models/Interview.js";
import Candidate from "../models/Candidate.js";
import { isAuthenticated, isHR } from "../validators/auth.validator.js";

const router = Router();

// Endpoint untuk upload wawancara, tidak berubah secara signifikan
router.post('/upload/:candidateId', isAuthenticated, isHR, async (req, res, next) => {
    const { candidateId } = req.params;
    const { interviewType, recordingType, recordingUrl } = req.body;
    const userId = req.user._id;

    if (!interviewType || !recordingUrl || !recordingType) {
        return res.status(400).json({ message: "Interview type, recording URL, and recording type are required." });
    }
    if (!['audio', 'video'].includes(recordingType)) {
        return res.status(400).json({ message: "Invalid recording type. Must be 'audio' or 'video'." });
    }

    try {
        const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found or you don't have permission to upload for this candidate." });
        }

        const newInterview = await Interview.create({
            userId,
            candidateId,
            interviewType,
            recordingUrl,
            recordingType,
            processStatus: 'Uploaded',
        });

        await Candidate.findByIdAndUpdate(candidateId, {
            $push: { interviews: newInterview._id }
        });

        res.status(201).json({
            message: "Interview recording uploaded successfully. Analysis will proceed shortly.",
            interview: newInterview
        });
    } catch (error) {
        console.error("Error uploading interview recording:", error);
        next(error);
    }
});

// Endpoint untuk mendapatkan detail interview, tidak berubah secara signifikan
router.get('/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    const { interviewId } = req.params;
    const userId = req.user._id;

    try {
        const interview = await Interview.findOne({ _id: interviewId, userId }).populate('candidateId');
        if (!interview) {
            return res.status(404).json({ message: "Interview not found or you don't have access." });
        }
        res.json(interview);
    } catch (error) {
        console.error("Error fetching interview details:", error);
        next(error);
    }
});


// Endpoint untuk HR me-review wawancara
router.put('/:interviewId/review', isAuthenticated, isHR, async (req, res, next) => {
    const { interviewId } = req.params;
    const { hrRating, hrNotes, hrFeedbackProvided } = req.body || {};;
    const userId = req.user._id;

    if (typeof hrRating !== 'number' || hrRating < 0 || hrRating > 5) {
        return res.status(400).json({ message: "HR Rating must be a number between 0 and 5." });
    }

    try {
        const interview = await Interview.findOneAndUpdate(
            { _id: interviewId, userId: userId },
            {
                $set: {
                    hrRating: hrRating,
                    hrNotes: hrNotes,
                    hrFeedbackProvided: true, // <--- PASTIKAN INI TRUE SAAT DI-REVIEW
                    processStatus: 'HR Reviewed' // <--- Set status final
                }
            },
            { new: true }
        ).populate('candidateId');

        if (!interview) {
            return res.status(404).json({ message: "Interview not found or you don't have access." });
        }

        // Opsional: Perbarui hrRating di Candidate. Ini bisa menjadi rata-rata
        // Jika Anda hanya ingin menyimpan rating dari interview TERAKHIR yang di-review:
        await Candidate.findByIdAndUpdate(interview.candidateId, {
            $set: {
                hrRating: hrRating // Update rating kandidat dengan rating wawancara ini
            }
        });

        res.json({
            message: "Interview review updated successfully.",
            interview: interview
        });
    } catch (error) {
        console.error("Error updating interview review:", error);
        next(error);
    }
});

// Endpoint untuk menghapus interview, tetap sama
router.delete('/:interviewId', isAuthenticated, isHR, async (req, res, next) => {
    const { interviewId } = req.params;
    const userId = req.user._id;

    try {
        const interview = await Interview.findOneAndDelete({ _id: interviewId, userId: userId });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found or you don't have access." });
        }

        await Candidate.findByIdAndUpdate(interview.candidateId, {
            $pull: { interviews: interview._id }
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting interview:", error);
        next(error);
    }
});

export default router;