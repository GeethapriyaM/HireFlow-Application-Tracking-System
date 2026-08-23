const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const candidateRoute = require("./Routes/candidateRoute");
const interviewRoute = require("./Routes/interviewRoute");
const jobRoute = require("./Routes/jobRoutes");
const analyticsRoute = require("./Routes/analyticsRoute");
const authRoute = require("./Routes/authRoute");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const applicationRoute = require("./Routes/applicationRoute");


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
);

app.use("/api/auth", authRoute);
app.use("/api/applications", applicationRoute);

// HOME
app.get("/", (req, res) => {
    res.json({
        message: "HireFlow API is running"
    });
});
// TEST PROTECTED ROUTE
app.get("/api/auth/test", authMiddleware, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    });
});
// TEST RECRUITER ACCESS
app.get(
    "/api/auth/recruiter-test",
    authMiddleware,
    roleMiddleware("recruiter"),
    (req, res) => {
        res.json({
            message: "Recruiter access granted",
            user: req.user
        });
    }
);

// TEST CANDIDATE ACCESS
app.get(
    "/api/auth/candidate-test",
    authMiddleware,
    roleMiddleware("candidate"),
    (req, res) => {
        res.json({
            message: "Candidate access granted",
            user: req.user
        });
    }
);

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`HireFlow server running on port ${PORT}`);
});