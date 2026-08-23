const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
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

        coverLetter: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);


// Prevent duplicate applications
// from the same candidate for the same job

applicationSchema.index(
    {
        candidate: 1,
        job: 1
    },
    {
        unique: true
    }
);


const Application = mongoose.model(
    "Application",
    applicationSchema
);


module.exports = Application;