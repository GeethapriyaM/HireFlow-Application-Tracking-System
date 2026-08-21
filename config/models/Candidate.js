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
      unique: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    position: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: Number,
      default: 0
    },

    skills: {
      type: [String],
      default: []
    },

    location: {
      type: String,
      default: ""
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

    resume: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);