import mongoose, { Schema } from "mongoose";

const CandidateSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        position: {
            type: String,
            required: true,
            trim: true
        },
        appliedDate: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // applicationStatus: { // Opsional: tetap pertahankan jika ada alur aplikasi yang lebih luas
        //     type: String,
        //     enum: ['Applied', 'Under Review', 'Interview Scheduled', 'Interviewed', 'Rejected', 'Hired'],
        //     default: 'Applied'
        // },
        interviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview'
        }],
        hrRating: { // Rating HR, ini akan menjadi rata-rata dari semua hrRating wawancara atau rating dari interview terakhir yang direview HR
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        // hrFeedbackSent: { // Ini akan dihapus/diganti karena status Reviewed/Unreviewed di dashboard
        //     type: Boolean,
        //     default: false
        // }
    },
    {
        timestamps: true
    }
);

const Candidate = mongoose.model('Candidate', CandidateSchema);

export default Candidate;