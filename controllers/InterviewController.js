const Interview = require("../config/models/Interview");
const Candidate = require("../config/models/Candidate");


// ============================================================
// CREATE INTERVIEW
// ============================================================

const createInterview = async (req, res) => {

    try {

        const {
            candidateId,
            interviewDate,
            interviewTime,
            interviewType,
            interviewer
        } = req.body;


        // Validate candidate ID
        if (!candidateId) {

            return res.status(400).json({
                message: "Candidate ID is required"
            });

        }


        // Check whether candidate exists
        const candidate =
            await Candidate.findById(candidateId);


        if (!candidate) {

            return res.status(404).json({
                message: "Candidate not found"
            });

        }


        // Validate required interview fields
        if (
            !interviewDate ||
            !interviewTime ||
            !interviewType ||
            !interviewer
        ) {

            return res.status(400).json({
                message:
                    "Interview date, time, type and interviewer are required"
            });

        }


        // Create interview
        const interview =
            await Interview.create({

                candidateId,
                interviewDate,
                interviewTime,
                interviewType,
                interviewer,
                status: "Scheduled"

            });


        // Update candidate stage
        candidate.stage = "Interview";

        await candidate.save();


        res.status(201).json({

            message: "Interview scheduled successfully",

            interview

        });

    } catch (error) {

        console.error(
            "Create Interview Error:",
            error
        );

        res.status(500).json({

            message: "Failed to schedule interview",

            error: error.message

        });

    }

};



// ============================================================
// GET ALL INTERVIEWS
// ============================================================

const getAllInterviews = async (req, res) => {

    try {

        const interviews =
            await Interview.find()
                .populate(
                    "candidateId",
                    "name email jobRole stage"
                )
                .sort({
                    interviewDate: 1
                });


        res.status(200).json(interviews);

    } catch (error) {

        console.error(
            "Get Interviews Error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch interviews",

            error: error.message

        });

    }

};



// ============================================================
// GET INTERVIEW BY ID
// ============================================================

const getInterviewById = async (req, res) => {

    try {

        const interview =
            await Interview.findById(
                req.params.id
            ).populate(
                "candidateId",
                "name email jobRole stage experienceYears skills"
            );


        if (!interview) {

            return res.status(404).json({

                message: "Interview not found"

            });

        }


        res.status(200).json(interview);

    } catch (error) {

        console.error(
            "Get Interview Error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch interview",

            error: error.message

        });

    }

};



// ============================================================
// UPDATE INTERVIEW
// ============================================================

const updateInterview = async (req, res) => {

    try {

        const interview =
            await Interview.findById(
                req.params.id
            );


        if (!interview) {

            return res.status(404).json({

                message: "Interview not found"

            });

        }


        const {
            interviewDate,
            interviewTime,
            interviewType,
            interviewer,
            status
        } = req.body;


        if (interviewDate !== undefined) {

            interview.interviewDate =
                interviewDate;

        }


        if (interviewTime !== undefined) {

            interview.interviewTime =
                interviewTime;

        }


        if (interviewType !== undefined) {

            interview.interviewType =
                interviewType;

        }


        if (interviewer !== undefined) {

            interview.interviewer =
                interviewer;

        }


        if (status !== undefined) {

            interview.status =
                status;

        }


        await interview.save();


        res.status(200).json({

            message: "Interview updated successfully",

            interview

        });

    } catch (error) {

        console.error(
            "Update Interview Error:",
            error
        );

        res.status(500).json({

            message: "Failed to update interview",

            error: error.message

        });

    }

};



// ============================================================
// DELETE / CANCEL INTERVIEW
// ============================================================

const cancelInterview = async (req, res) => {

    try {

        const interview =
            await Interview.findById(
                req.params.id
            );


        if (!interview) {

            return res.status(404).json({

                message: "Interview not found"

            });

        }


        interview.status = "Cancelled";

        await interview.save();


        res.status(200).json({

            message: "Interview cancelled successfully",

            interview

        });

    } catch (error) {

        console.error(
            "Cancel Interview Error:",
            error
        );

        res.status(500).json({

            message: "Failed to cancel interview",

            error: error.message

        });

    }

};



module.exports = {

    createInterview,
    getAllInterviews,
    getInterviewById,
    updateInterview,
    cancelInterview

};