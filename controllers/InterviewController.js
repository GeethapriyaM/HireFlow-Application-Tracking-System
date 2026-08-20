const Interview = require("../config/models/Interview");
const Candidate = require("../config/models/Candidate");


// ============================================================
// CREATE INTERVIEW
// ============================================================

const createInterview = async (req, res) => {

    try {

        console.log("========== CREATE INTERVIEW ==========");
        console.log("Request body:", req.body);


        const {
            candidateId,
            interviewDate,
            interviewTime,
            interviewType,
            interviewer
        } = req.body;


        // =====================================================
        // VALIDATION
        // =====================================================

        if (!candidateId) {

            return res.status(400).json({
                message: "Candidate ID is required"
            });

        }


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


        // =====================================================
        // FIND CANDIDATE
        // =====================================================

        console.log("Finding candidate...");

        const candidate =
            await Candidate.findById(candidateId);


        console.log("Candidate found:", candidate);


        if (!candidate) {

            return res.status(404).json({
                message: "Candidate not found"
            });

        }


        // =====================================================
        // REJECTED CANDIDATE CHECK
        // =====================================================

        if (candidate.status === "Rejected") {

            return res.status(400).json({
                message:
                    "Rejected candidate cannot be scheduled for an interview"
            });

        }


        // =====================================================
        // CREATE INTERVIEW
        // =====================================================

        console.log("Creating interview...");

        const interview =
            await Interview.create({

                candidateId: candidate._id,

                interviewDate:
                    new Date(interviewDate),

                interviewTime,

                interviewType,

                interviewer,

                status: "Scheduled"

            });


        console.log(
            "Interview created:",
            interview
        );


        // =====================================================
        // UPDATE CANDIDATE STATUS
        // =====================================================

        candidate.status = "Interview";

        await candidate.save();


        console.log(
            "Candidate status updated successfully"
        );


        // =====================================================
        // SUCCESS
        // =====================================================

        res.status(201).json({

            message:
                "Interview scheduled successfully",

            interview

        });


    } catch (error) {

        console.error(
            "CREATE INTERVIEW ERROR:",
            error
        );

        console.error(
            error.stack
        );


        res.status(500).json({

            message:
                "Failed to schedule interview",

            error:
                error.message

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
                    "name email position status experience skills"
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

            message:
                "Failed to fetch interviews",

            error:
                error.message

        });

    }

};
// ============================================================
// GET INTERVIEWS BY CANDIDATE
// ============================================================

const getInterviewsByCandidate = async (req, res) => {

    try {

        const { candidateId } = req.params;

        console.log(
            "Getting interviews for candidate:",
            candidateId
        );


        const interviews =
            await Interview.find({
                candidateId: candidateId
            })
            .populate(
                "candidateId",
                "name email position status experience skills"
            )
            .sort({
                interviewDate: -1
            });


        res.status(200).json(interviews);


    } catch (error) {

        console.error(
            "Get Candidate Interviews Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch candidate interviews",

            error:
                error.message

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
                "name email position status experience skills"
            );


        if (!interview) {

            return res.status(404).json({

                message:
                    "Interview not found"

            });

        }


        res.status(200).json(interview);


    } catch (error) {

        console.error(
            "Get Interview Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch interview",

            error:
                error.message

        });

    }

};


// ============================================================
// UPDATE / RESCHEDULE / EVALUATE INTERVIEW
// ============================================================

const updateInterview = async (req, res) => {

    try {

        const interview =
            await Interview.findById(
                req.params.id
            );


        if (!interview) {

            return res.status(404).json({

                message:
                    "Interview not found"

            });

        }


        const {
            interviewDate,
            interviewTime,
            interviewType,
            interviewer,
            status,

            evaluationScore,
            evaluationFeedback,
            evaluationDecision

        } = req.body;


        // =====================================================
        // INTERVIEW UPDATE
        // =====================================================

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


        // =====================================================
        // EVALUATION
        // =====================================================

        if (evaluationScore !== undefined) {

            interview.evaluationScore =
                evaluationScore;

        }


        if (evaluationFeedback !== undefined) {

            interview.evaluationFeedback =
                evaluationFeedback;

        }


        if (evaluationDecision !== undefined) {

            interview.evaluationDecision =
                evaluationDecision;

        }


        // =====================================================
        // SAVE INTERVIEW
        // =====================================================

        await interview.save();


        // =====================================================
        // UPDATE CANDIDATE AFTER EVALUATION
        // =====================================================

        if (
            status === "Completed" &&
            evaluationDecision !== undefined
        ) {

            const candidate =
                await Candidate.findById(
                    interview.candidateId
                );


            if (candidate) {

                if (
                    evaluationDecision === "selected"
                ) {

                    candidate.status =
                        "Selected";

                }

                else if (
                    evaluationDecision === "rejected"
                ) {

                    candidate.status =
                        "Rejected";

                }


                await candidate.save();

            }

        }


        // =====================================================
        // RETURN UPDATED INTERVIEW
        // =====================================================

        const updatedInterview =
            await Interview.findById(
                interview._id
            ).populate(
                "candidateId",
                "name email position status experience skills"
            );


        res.status(200).json({

            message:
                "Interview updated successfully",

            interview:
                updatedInterview

        });


    } catch (error) {

        console.error(
            "Update Interview Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update interview",

            error:
                error.message

        });

    }

};


// ============================================================
// CANCEL INTERVIEW
// ============================================================

const cancelInterview = async (req, res) => {

    try {

        const interview =
            await Interview.findById(
                req.params.id
            );


        if (!interview) {

            return res.status(404).json({

                message:
                    "Interview not found"

            });

        }


        // Completed interviews cannot be cancelled

        if (
            interview.status === "Completed"
        ) {

            return res.status(400).json({

                message:
                    "Completed interview cannot be cancelled"

            });

        }


        interview.status =
            "Cancelled";


        await interview.save();


        const updatedInterview =
            await Interview.findById(
                interview._id
            ).populate(
                "candidateId",
                "name email position status experience skills"
            );


        res.status(200).json({

            message:
                "Interview cancelled successfully",

            interview:
                updatedInterview

        });


    } catch (error) {

        console.error(
            "Cancel Interview Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to cancel interview",

            error:
                error.message

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    createInterview,
    getAllInterviews,
    getInterviewsByCandidate,
    getInterviewById,
    updateInterview,
    cancelInterview

};