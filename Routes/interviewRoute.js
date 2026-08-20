const express = require("express");

const router = express.Router();

const {
    createInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByCandidate,
    updateInterview,
    cancelInterview
} = require("../controllers/InterviewController");


// ============================================================
// CREATE / SCHEDULE INTERVIEW
// ============================================================

router.post("/", createInterview);


// ============================================================
// GET ALL INTERVIEWS
// ============================================================

router.get("/", getAllInterviews);


// ============================================================
// GET INTERVIEWS BY CANDIDATE
// IMPORTANT: Keep this BEFORE /:id
// ============================================================

router.get(
    "/candidate/:candidateId",
    getInterviewsByCandidate
);


// ============================================================
// GET INTERVIEW BY ID
// ============================================================

router.get("/:id", getInterviewById);


// ============================================================
// UPDATE / RESCHEDULE / EVALUATE
// ============================================================

router.put("/:id", updateInterview);


// ============================================================
// CANCEL INTERVIEW
// ============================================================

router.patch("/:id/cancel", cancelInterview);


module.exports = router;