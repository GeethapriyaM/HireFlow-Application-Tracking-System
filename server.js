const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const connectCandidateRoute =
    require("./Routes/candidateRoute.js");

const app = express();


// DATABASE
connectDB();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// CANDIDATE ROUTES
app.use(
    "/api/candidates",
    connectCandidateRoute
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

    console.log(
        `HireFlow server running on port ${PORT}`
    );

});