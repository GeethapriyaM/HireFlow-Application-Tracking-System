const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        // ============================================================
        // CANDIDATE
        // ============================================================

        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
        },

        // ============================================================
        // INTERVIEW DETAILS
        // ============================================================

        interviewDate: {
            type: Date,
            required: true
        },

        interviewTime: {
            type: String,
            required: true,
            trim: true
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

        // ============================================================
        // INTERVIEW STATUS
        // ============================================================

        status: {
            type: String,
            enum: [
                "Scheduled",
                "Completed",
                "Cancelled",
                "Rescheduled"
            ],
            default: "Scheduled"
        },

        // ============================================================
        // EVALUATION
        // ============================================================

        evaluationScore: {
            type: Number,
            min: 0,
            max: 100
        },

        evaluationFeedback: {
            type: String,
            trim: true,
            default: ""
        },

        evaluationDecision: {
            type: String,
            enum: [
                "selected",
                "rejected"
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);