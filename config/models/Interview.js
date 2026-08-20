const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
        },

        interviewDate: {
            type: Date,
            required: true
        },

        interviewTime: {
            type: String,
            required: true
        },

        interviewType: {
            type: String,
            enum: [
                "Technical",
                "HR",
                "Managerial",
                "Other"
            ],
            required: true
        },

        interviewer: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Scheduled",
                "Completed",
                "Cancelled",
                "Rescheduled"
            ],
            default: "Scheduled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Interview",
    interviewSchema
);