import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    session: {type: mongoose.Schema.Types.ObjectId, ref: "Session"},
    question: String,
    answer: String,
    note: String,
    isPinned: {type: Boolean, default: false}
}, {timestamps: true});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;