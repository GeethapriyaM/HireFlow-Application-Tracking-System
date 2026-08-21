const Candidate = require("../config/models/Candidate");
const Job = require("../models/Job");
const Interview = require("../config/models/Interview");


// ============================================================
// GET ANALYTICS
// ============================================================

const getAnalytics = async (req, res) => {

    try {

        // ========================================================
        // CANDIDATE ANALYTICS
        // ========================================================

        const totalCandidates =
            await Candidate.countDocuments();


        const candidateStatus =
            await Candidate.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);


        // ========================================================
        // JOB ANALYTICS
        // ========================================================

        const totalJobs =
            await Job.countDocuments();


        const activeJobs =
            await Job.countDocuments({
                status: "Active"
            });


        const draftJobs =
            await Job.countDocuments({
                status: "Draft"
            });


        const closedJobs =
            await Job.countDocuments({
                status: "Closed"
            });


        // ========================================================
        // INTERVIEW ANALYTICS
        // ========================================================

        const totalInterviews =
            await Interview.countDocuments();


        const scheduledInterviews =
            await Interview.countDocuments({
                status: "Scheduled"
            });


        const completedInterviews =
            await Interview.countDocuments({
                status: "Completed"
            });


        const cancelledInterviews =
            await Interview.countDocuments({
                status: "Cancelled"
            });


        const rescheduledInterviews =
            await Interview.countDocuments({
                status: "Rescheduled"
            });


        // ========================================================
        // RESPONSE
        // ========================================================

        res.status(200).json({

            candidates: {

                total: totalCandidates,

                byStatus: candidateStatus

            },

            jobs: {

                total: totalJobs,

                active: activeJobs,

                draft: draftJobs,

                closed: closedJobs

            },

            interviews: {

                total: totalInterviews,

                scheduled: scheduledInterviews,

                completed: completedInterviews,

                cancelled: cancelledInterviews,

                rescheduled: rescheduledInterviews

            }

        });

    }


    catch (error) {

        console.error(
            "Analytics error:",
            error
        );


        res.status(500).json({

            message: "Failed to fetch analytics",

            error: error.message

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getAnalytics
};