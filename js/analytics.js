const API_URL = "http://localhost:3000/api";


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadAnalytics();

});


// ============================================================
// LOAD ANALYTICS
// ============================================================

async function loadAnalytics() {

    try {

        const response = await fetch(
            `${API_URL}/analytics`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load analytics"
            );

        }


        const data =
            await response.json();


        console.log(
            "Analytics data:",
            data
        );


        updateDashboardStats(data);

        updateCandidateAnalytics(data);

        updateJobAnalytics(data);

        updateInterviewAnalytics(data);

        updateSummary(data);


    }

    catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );

    }

}


// ============================================================
// MAIN DASHBOARD STATISTICS
// ============================================================

function updateDashboardStats(data) {

    document.getElementById(
        "totalCandidates"
    ).textContent =
        data.candidates?.total || 0;


    document.getElementById(
        "totalJobs"
    ).textContent =
        data.jobs?.total || 0;


    document.getElementById(
        "activeJobs"
    ).textContent =
        data.jobs?.active || 0;


    document.getElementById(
        "totalInterviews"
    ).textContent =
        data.interviews?.total || 0;

}


// ============================================================
// CANDIDATE ANALYTICS
// ============================================================

function updateCandidateAnalytics(data) {

    const statuses =
        data.candidates?.byStatus || [];


    let interview = 0;

    let selected = 0;

    let rejected = 0;

    let screening = 0;


    statuses.forEach(item => {

        const status =
            String(item._id || "")
                .toLowerCase();


        if (status === "interview") {

            interview =
                item.count;

        }


        else if (status === "selected") {

            selected =
                item.count;

        }


        else if (status === "rejected") {

            rejected =
                item.count;

        }


        else if (status === "screening") {

            screening =
                item.count;

        }

    });


    document.getElementById(
        "interviewCandidates"
    ).textContent =
        interview;


    document.getElementById(
        "selectedCandidates"
    ).textContent =
        selected;


    document.getElementById(
        "rejectedCandidates"
    ).textContent =
        rejected;


    document.getElementById(
        "screeningCandidates"
    ).textContent =
        screening;

}


// ============================================================
// JOB ANALYTICS
// ============================================================

function updateJobAnalytics(data) {

    const jobs =
        data.jobs || {};


    document.getElementById(
        "analyticsActiveJobs"
    ).textContent =
        jobs.active || 0;


    document.getElementById(
        "draftJobs"
    ).textContent =
        jobs.draft || 0;


    document.getElementById(
        "closedJobs"
    ).textContent =
        jobs.closed || 0;


    document.getElementById(
        "analyticsTotalJobs"
    ).textContent =
        jobs.total || 0;

}


// ============================================================
// INTERVIEW ANALYTICS
// ============================================================

function updateInterviewAnalytics(data) {

    const interviews =
        data.interviews || {};


    document.getElementById(
        "scheduledInterviews"
    ).textContent =
        interviews.scheduled || 0;


    document.getElementById(
        "completedInterviews"
    ).textContent =
        interviews.completed || 0;


    document.getElementById(
        "cancelledInterviews"
    ).textContent =
        interviews.cancelled || 0;


    document.getElementById(
        "rescheduledInterviews"
    ).textContent =
        interviews.rescheduled || 0;

}


// ============================================================
// RECRUITMENT SUMMARY
// ============================================================

function updateSummary(data) {

    document.getElementById(
        "summaryCandidates"
    ).textContent =
        data.candidates?.total || 0;


    document.getElementById(
        "summaryJobs"
    ).textContent =
        data.jobs?.total || 0;


    document.getElementById(
        "summaryActiveJobs"
    ).textContent =
        data.jobs?.active || 0;


    document.getElementById(
        "summaryInterviews"
    ).textContent =
        data.interviews?.total || 0;

}