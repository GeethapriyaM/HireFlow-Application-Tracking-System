const express = require("express");

const router = express.Router();

const candidateController = require("../controllers/candidateController");

// GET all candidates
router.get("/", candidateController.getAllCandidates);

// GET candidate by ID
router.get("/:id", candidateController.getCandidateById);

// CREATE candidate
router.post("/", candidateController.createCandidate);

// UPDATE candidate
router.put("/:id", candidateController.updateCandidate);

// DELETE candidate
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;