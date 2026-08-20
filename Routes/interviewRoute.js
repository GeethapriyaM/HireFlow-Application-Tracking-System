const express = require("express");

const router = express.Router();

const {
    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    cancelInterview
} = require("../controllers/InterviewController");


// Schedule Interview
router.post(
    "/",
    createInterview
);


// Get all Interviews
router.get(
    "/",
    getAllInterviews
);


// Get Interview by ID
router.get(
    "/:id",
    getInterviewById
);


// Update / Reschedule Interview
router.put(
    "/:id",
    updateInterview
);


// Cancel Interview
router.patch(
    "/:id/cancel",
    cancelInterview
);


module.exports = router;