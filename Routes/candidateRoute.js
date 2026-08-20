const express = require("express");

const {
    getAllCandidate,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    searchCandidate,
    updateCandidateStage,
    bulkUpdateStage
} = require("../Controllers/candidateController");

const router = express.Router();


// GET ALL
router.get("/", getAllCandidate);


// SEARCH
router.get("/search", searchCandidate);


// BULK STAGE UPDATE
router.patch("/bulk/stage", bulkUpdateStage);


// GET BY ID
router.get("/:id", getCandidateById);


// CREATE
router.post("/", createCandidate);


// UPDATE
router.put("/:id", updateCandidate);


// UPDATE STAGE
router.patch("/:id/stage", updateCandidateStage);


// DELETE
router.delete("/:id", deleteCandidate);


module.exports = router;