const express = require("express");

const router = express.Router();

const candidateController = require("../controllers/candidateController");

// GET all candidates
router.get("/", candidateController.getAllCandidates);
//Post Apply APi
router.post("/apply", candidateController.applyForJob);

// GET candidate by ID
router.get("/:id", candidateController.getCandidateById);

// CREATE candidate
router.post("/", candidateController.createCandidate);

// UPDATE candidate
router.put("/:id", candidateController.updateCandidate);

// DELETE candidate
router.delete("/:id", candidateController.deleteCandidate);


module.exports = router;