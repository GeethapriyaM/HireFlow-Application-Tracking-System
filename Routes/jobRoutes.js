const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// Create a new job
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);

        const savedJob = await job.save();

        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create job",
            error: error.message
        });
    }
});

// Get all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
});
// Get job statistics
router.get("/stats", async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();

        const activeJobs = await Job.countDocuments({
            status: "Active"
        });

        const draftJobs = await Job.countDocuments({
            status: "Draft"
        });

        const closedJobs = await Job.countDocuments({
            status: "Closed"
        });

        res.status(200).json({
            totalJobs,
            activeJobs,
            draftJobs,
            closedJobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch job statistics",
            error: error.message
        });
    }
});
// Get one job by ID
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(400).json({
            message: "Invalid job ID",
            error: error.message
        });
    }
});
// Update a job by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(updatedJob);

    } catch (error) {
        res.status(400).json({
            message: "Failed to update job",
            error: error.message
        });
    }
});
// Delete a job by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job deleted successfully",
            job: deletedJob
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete job",
            error: error.message
        });
    }
});

module.exports = router;