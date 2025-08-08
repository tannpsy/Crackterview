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
        hrRatings: {
            'Fit for the Position': {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
            'Culture Fit': {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
            'Motivation': {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
            'Future Potential': {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
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