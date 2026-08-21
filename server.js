const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const candidateRoute = require("./Routes/candidateRoute");
const interviewRoute = require("./Routes/interviewRoute");
const jobRoute = require("./Routes/jobRoutes");
const analyticsRoute = require("./Routes/analyticsRoute");



const app = express();

// DATABASE
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CANDIDATE ROUTES
app.use("/api/candidates", candidateRoute);

// INTERVIEW ROUTES
app.use("/api/interviews", interviewRoute);
// Job Routes
app.use("/api/jobs", jobRoute);

//Analytics

app.use(
    "/api/analytics",
    analyticsRoute
);app.use(
    "/api/analytics",
    analyticsRoute
);

// HOME
app.get("/", (req, res) => {
    res.json({
        message: "HireFlow API is running"
    });
});

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HireFlow server running on port ${PORT}`);
});