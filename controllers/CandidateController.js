const Candidate = require("../config/models/Candidate");

// GET all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    res.status(200).json(candidates);
  } catch (error) {
    console.error("Get candidates error:", error);

    res.status(500).json({
      message: "Failed to fetch candidates",
      error: error.message
    });
  }
};

// GET candidate by ID
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error("Get candidate error:", error);

    res.status(500).json({
      message: "Failed to fetch candidate",
      error: error.message
    });
  }
};

// CREATE candidate
const createCandidate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      experience,
      location,
      skills,
      status,
      resume
    } = req.body;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        message: "Name, email, phone and position are required"
      });
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      experience,
      location,
      skills,
      status,
      resume
    });

    const savedCandidate = await candidate.save();

    res.status(201).json({
      message: "Candidate created successfully",
      candidate: savedCandidate
    });
  } catch (error) {
    console.error("Create candidate error:", error);

    res.status(500).json({
      message: "Failed to create candidate",
      error: error.message
    });
  }
};

// UPDATE candidate
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      message: "Candidate updated successfully",
      candidate
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    res.status(500).json({
      message: "Failed to update candidate",
      error: error.message
    });
  }
};

// DELETE candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    console.error("Delete candidate error:", error);

    res.status(500).json({
      message: "Failed to delete candidate",
      error: error.message
    });
  }
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
};