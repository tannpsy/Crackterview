// Backend/models/Interview.js (Revisi)
import mongoose, { Schema } from "mongoose";

const InterviewSchema = new Schema(
    {
        userId: { // User aplikasi (HR) yang MENGUNGGAH/MENGELOLA wawancara ini
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        candidateId: { // Referensi ke kandidat yang diinterview
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true,
            index: true
        },
        interviewType: { // Misal: "Technical", "Behavioral", "Initial Screening"
            type: String,
            required: true
        },
        recordingUrl: {
            type: String,
            required: true
        },
        recordingType: {
            type: String,
            enum: ['audio', 'video'],
            required: true
        },
        processStatus: { // Status proses di backend: 'Uploaded', 'Analyzing', 'Analysis Complete', 'HR Reviewed', 'Failed'
            type: String,
            enum: ['Uploaded', 'Analyzing', 'Analysis Complete', 'HR Reviewed', 'Failed'],
            default: 'Uploaded'
        },
        transcription: { // Hasil transkripsi jika rekaman berupa audio/video
            type: String
        },
        aiAnalysisResult: { // JSON object untuk hasil analisis AI yang lebih detail
            type: Object
        },
        overallAiFeedback: { // Ringkasan feedback dari AI
            type: String
        },
        overallAiScore: { // Skor keseluruhan dari AI (misal: 0-100)
            type: Number
        },
        hrRating: { // Rating dari HR (jika HR menilai wawancara ini)
            type: Number,
            min: 0,
            max: 5
        },
        hrNotes: { // Catatan dari HR setelah meninjau wawancara
            type: String
        },
        // Indikator utama untuk "Reviewed" atau "Unreviewed" di dashboard
        hrFeedbackProvided: {
            type: Boolean,
            default: false
        },
        emailSent: {
            type: Boolean,
            default: false
        },
        uploadedAt: { // Waktu wawancara diunggah
            type: Date,
            default: Date.now
        },
        durationInSeconds: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview;