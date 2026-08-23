const express = require("express");

const Application = require("../models/Application");
const Job = require("../models/Job");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// CANDIDATE - APPLY FOR A JOB
// POST /api/applications
// =====================================================

router.post(
    "/",
    authenticateToken,
    authorizeRole("candidate"),
    async (req, res) => {

        try {

            const { jobId, coverLetter } = req.body;

            if (!jobId) {
                return res.status(400).json({
                    message: "Job ID is required"
                });
            }


            // Check whether job exists
            const job = await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }


            // Candidate can apply only for active jobs
            if (job.status !== "Active") {
                return res.status(400).json({
                    message: "This job is not currently accepting applications"
                });
            }


            // Check duplicate application
            const existingApplication =
                await Application.findOne({
                    candidate: req.user.id,
                    job: jobId
                });

            if (existingApplication) {
                return res.status(400).json({
                    message: "You have already applied for this job"
                });
            }


            // Create application
            const application = new Application({

                candidate: req.user.id,

                job: jobId,

                coverLetter: coverLetter || ""

            });


            const savedApplication =
                await application.save();


            res.status(201).json({

                message: "Application submitted successfully",

                application: savedApplication

            });


        } catch (error) {

            console.error(
                "Apply job error:",
                error
            );

            res.status(500).json({

                message: "Failed to submit application",

                error: error.message

            });

        }

    }
);


// =====================================================
// CANDIDATE - VIEW MY APPLICATIONS
// GET /api/applications/my
// =====================================================

router.get(
    "/my",
    authenticateToken,
    authorizeRole("candidate"),
    async (req, res) => {

        try {

            const applications =
                await Application.find({
                    candidate: req.user.id
                })
                .populate(
                    "job",
                    "title department location type status"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json(
                applications
            );


        } catch (error) {

            console.error(
                "Get my applications error:",
                error
            );

            res.status(500).json({

                message: "Failed to fetch applications",

                error: error.message

            });

        }

    }
);


// =====================================================
// RECRUITER - VIEW ALL APPLICATIONS
// GET /api/applications
// =====================================================

router.get(
    "/",
    authenticateToken,
    authorizeRole("recruiter"),
    async (req, res) => {

        try {

            const applications =
                await Application.find()

                .populate(
                    "candidate",
                    "name email"
                )

                .populate(
                    "job",
                    "title department location"
                )

                .sort({
                    createdAt: -1
                });


            res.status(200).json(
                applications
            );


        } catch (error) {

            console.error(
                "Get applications error:",
                error
            );

            res.status(500).json({

                message: "Failed to fetch applications",

                error: error.message

            });

        }

    }
);


// =====================================================
// RECRUITER - UPDATE APPLICATION STATUS
// PUT /api/applications/:id
// =====================================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRole("recruiter"),
    async (req, res) => {

        try {

            const { status } = req.body;


            const allowedStatuses = [
                "Applied",
                "Screening",
                "Interview",
                "Selected",
                "Rejected"
            ];


            if (!allowedStatuses.includes(status)) {

                return res.status(400).json({

                    message: "Invalid application status"

                });

            }


            const updatedApplication =
                await Application.findByIdAndUpdate(

                    req.params.id,

                    {
                        status
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                )

                .populate(
                    "candidate",
                    "name email"
                )

                .populate(
                    "job",
                    "title"
                );


            if (!updatedApplication) {

                return res.status(404).json({

                    message: "Application not found"

                });

            }


            res.status(200).json({

                message: "Application status updated",

                application: updatedApplication

            });


        } catch (error) {

            console.error(
                "Update application error:",
                error
            );

            res.status(500).json({

                message: "Failed to update application",

                error: error.message

            });

        }

    }
);


module.exports = router;