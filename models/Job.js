const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        experienceLevel: {
            type: String,
            required: true
        },

        salaryRange: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        responsibilities: {
            type: [String],
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Closed", "Draft"],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;