const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        portfolio: {
            type: String,
            default: ""
        },

        currentCompany: {
            type: String,
            default: ""
        },

        experienceYears: {
            type: Number,
            default: 0,
            min: 0
        },

        qualification: {
            type: String,
            default: ""
        },

        yop: {
            type: Number,
            default: null
        },

        education: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        coverLetter: {
            type: String,
            default: ""
        },

        resumeUrl: {
            type: String,
            default: ""
        },

        resumeOriginalName: {
            type: String,
            default: ""
        },

        jobRole: {
            type: String,
            required: true,
            trim: true
        },

        source: {
            type: String,
            enum: [
                "Careers Portal",
                "LinkedIn",
                "Referral",
                "Indeed",
                "Direct",
                "Other"
            ],
            default: "Careers Portal"
        },

        stage: {
            type: String,
            enum: [
                "Applied",
                "Screening",
                "Interview",
                "Selected",
                "Rejected"
            ],
            default: "Applied"
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        appliedDate: {
            type: Date,
            default: Date.now
        },

        rejectionReason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Candidate", candidateSchema);