import Candidate from "../models/Candidate.js";

export const createCandidate = async (req, res) => {
  try {
    const { name, email, position } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    if (!name || !email || !position) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const candidate = await Candidate.create({
      name,
      email,
      position,
      videoOrPhoto: fileUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Candidate created", candidate });
  } catch (error) {
    console.error("Create candidate error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCandidateStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalApplicants, totalInterviews, totalResponses, needResponse] = await Promise.all([
      Candidate.countDocuments({ createdBy: userId }),
      Candidate.countDocuments({ createdBy: userId, status: "interviewed" }),
      Candidate.countDocuments({
        createdBy: userId,
        $or: [{ aiScore: { $exists: true } }, { hrRating: { $exists: true } }],
      }),
      Candidate.countDocuments({ createdBy: userId, reviewed: false }),
    ]);

    res.json({ totalApplicants, totalInterviews, totalResponses, needResponse });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ createdBy: req.user._id });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const result = await Candidate.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!result) return res.status(404).json({ error: "Candidate not found" });
    res.json({ message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
