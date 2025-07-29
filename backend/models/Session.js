import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    session: {type: mongoose.Schema.Types.ObjectId, ref: "Session"},
    question: String,
    answer: String,
    note: String,
    isPinned: {type: Boolean, default: false}
}, {timestamps: true})

const Session = mongoose.model("Session", SessionSchema);
export default Session;