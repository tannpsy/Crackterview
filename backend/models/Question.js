import mongoose from "mongoose";

// const QuestionSchema = new mongoose.Schema({
//     session: {type: mongoose.Schema.Types.ObjectId, ref: "Session"},
//     question: String,
//     answer: String,
//     note: String,
//     isPinned: {type: Boolean, default: false}
// }, {timestamps: true});

// const Question = mongoose.model("Question", QuestionSchema);
// export default Question;

// const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    question: String,
    answer: String,
    note: String,
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("Question", questionSchema);

// module.exports = mongoose.model("Question", questionSchema);
