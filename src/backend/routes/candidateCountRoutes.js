import express from "express";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const candidate = new Candidate({
      ...req.body,
      createdBy: req.user._id,
    });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const candidates = await Candidate.find({ createdBy: req.user._id });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Candidate.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!result) return res.status(404).json({ error: "Candidate not found" });
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalApplicants, totalInterviews, totalResponses, needResponse] = await Promise.all([
      Candidate.countDocuments({ createdBy: userId }),
      Candidate.countDocuments({ createdBy: userId, status: "interviewed" }),
      Candidate.countDocuments({
        createdBy: userId,
        $or: [{ aiScore: { $exists: true } }, { hrRating: { $exists: true } }],
      }),
      Candidate.countDocuments({
        createdBy: userId,
        reviewed: false,
      }),
    ]);

    res.json({
      totalApplicants,
      totalInterviews,
      totalResponses,
      needResponse,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

export default router;
