import mongoose from "mongoose";

// const SessionSchema = new mongoose.Schema({
//     session: {type: mongoose.Schema.Types.ObjectId, ref: "Session"},
//     question: String,
//     answer: String,
//     note: String,
//     isPinned: {type: Boolean, default: false}
// }, {timestamps: true})

// const Session = mongoose.model("Session", SessionSchema);
// export default Session;

// const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    topicsToFocus: { type: String, required: true },
    description: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);

// module.exports = mongoose.model("Session", sessionSchema);
