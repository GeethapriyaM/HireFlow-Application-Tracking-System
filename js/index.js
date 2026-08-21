const API_URL = "http://localhost:3000/api";

let candidates = [];
let jobs = [];
let interviews = [];


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});


// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        await Promise.all([
            loadCandidates(),
            loadJobs(),
            loadInterviews()
        ]);

        updateStatistics();

        renderRecentCandidates();

        renderRecentJobs();

        renderUpcomingInterviews();

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }
}


// ============================================================
// LOAD CANDIDATES
// ============================================================

async function loadCandidates() {

    try {

        const response = await fetch(
            `${API_URL}/candidates`
        );

        if (!response.ok) {

            throw new Error(
                `Failed to load candidates: ${response.status}`
            );

        }

        const data = await response.json();

        candidates =
            Array.isArray(data)
                ? data
                : data.candidates || [];

        console.log(
            "Dashboard Candidates:",
            candidates
        );

    } catch (error) {

        console.error(
            "Error loading candidates:",
            error
        );

        candidates = [];

    }
}


// ============================================================
// LOAD JOBS
// ============================================================

async function loadJobs() {

    try {

        const response = await fetch(
            `${API_URL}/jobs`
        );

        if (!response.ok) {

            throw new Error(
                `Failed to load jobs: ${response.status}`
            );

        }

        const data = await response.json();

        jobs =
            Array.isArray(data)
                ? data
                : data.jobs || [];

        console.log(
            "Dashboard Jobs:",
            jobs
        );

    } catch (error) {

        console.error(
            "Error loading jobs:",
            error
        );

        jobs = [];

    }
}


// ============================================================
// LOAD INTERVIEWS
// ============================================================

async function loadInterviews() {

    try {

        const response = await fetch(
            `${API_URL}/interviews`
        );

        if (!response.ok) {

            throw new Error(
                `Failed to load interviews: ${response.status}`
            );

        }

        const data = await response.json();

        interviews =
            Array.isArray(data)
                ? data
                : data.interviews || [];

        console.log(
            "Dashboard Interviews:",
            interviews
        );

    } catch (error) {

        console.error(
            "Error loading interviews:",
            error
        );

        interviews = [];

    }
}


// ============================================================
// UPDATE DASHBOARD STATISTICS
// ============================================================

function updateStatistics() {

    // ---------------------------------------------------------
    // TOTAL CANDIDATES
    // ---------------------------------------------------------

    setElementText(
        "totalCandidates",
        candidates.length
    );


    // ---------------------------------------------------------
    // TOTAL JOBS
    // ---------------------------------------------------------

    setElementText(
        "totalJobs",
        jobs.length
    );


    // ---------------------------------------------------------
    // ACTIVE JOBS
    // ---------------------------------------------------------

    const activeJobs =
        jobs.filter(job => {

            const status =
                String(
                    job.status || ""
                )
                .trim()
                .toLowerCase();

            return status === "active";

        }).length;


    setElementText(
        "activeJobs",
        activeJobs
    );


    // ---------------------------------------------------------
    // SCHEDULED INTERVIEWS
    // ---------------------------------------------------------

    const scheduledInterviews =
        interviews.filter(interview => {

            const status =
                String(
                    interview.status || ""
                )
                .trim()
                .toLowerCase();

            return (
                status === "scheduled" ||
                status === "rescheduled"
            );

        }).length;


    setElementText(
        "scheduledInterviews",
        scheduledInterviews
    );
}


// ============================================================
// RECENT CANDIDATES
// ============================================================

function renderRecentCandidates() {

    const tableBody =
        document.getElementById(
            "recentCandidates"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    // ---------------------------------------------------------
    // NO CANDIDATES
    // ---------------------------------------------------------

    if (candidates.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="loading"
                >
                    No candidates found.
                </td>
            </tr>
        `;

        return;
    }


    // ---------------------------------------------------------
    // SORT BY CREATED DATE
    // ---------------------------------------------------------

    const recentCandidates =
        [...candidates]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .slice(0, 5);


    // ---------------------------------------------------------
    // DISPLAY CANDIDATES
    // ---------------------------------------------------------

    recentCandidates.forEach(candidate => {

        const name =
            candidate.name ||
            candidate.fullName ||
            `${candidate.firstName || ""} ${candidate.lastName || ""}`
                .trim() ||
            "Unnamed Candidate";


        const email =
            candidate.email ||
            "-";


        const status =
            candidate.status ||
            "Active";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="candidate-name">
                    ${escapeHTML(name)}
                </span>

            </td>

            <td>

                <span class="email">
                    ${escapeHTML(email)}
                </span>

            </td>

            <td>

                <span class="status ${getStatusClass(status)}">
                    ${escapeHTML(status)}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// ============================================================
// RECENT JOBS
// ============================================================

function renderRecentJobs() {

    const tableBody =
        document.getElementById(
            "recentJobs"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    // ---------------------------------------------------------
    // NO JOBS
    // ---------------------------------------------------------

    if (jobs.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="loading"
                >
                    No jobs found.
                </td>
            </tr>
        `;

        return;
    }


    // ---------------------------------------------------------
    // SORT JOBS
    // ---------------------------------------------------------

    const recentJobs =
        [...jobs]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .slice(0, 5);


    // ---------------------------------------------------------
    // DISPLAY JOBS
    // ---------------------------------------------------------

    recentJobs.forEach(job => {

        const title =
            job.title ||
            job.jobTitle ||
            "Untitled Job";


        const location =
            job.location ||
            "-";


        const status =
            job.status ||
            "Active";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="job-name">
                    ${escapeHTML(title)}
                </span>

            </td>

            <td>

                <span class="location">
                    ${escapeHTML(location)}
                </span>

            </td>

            <td>

                <span class="status ${getStatusClass(status)}">
                    ${escapeHTML(status)}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// ============================================================
// UPCOMING INTERVIEWS
// ============================================================

function renderUpcomingInterviews() {

    const tableBody =
        document.getElementById(
            "upcomingInterviews"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    console.log(
        "Rendering Dashboard Interviews:",
        interviews
    );


    // ---------------------------------------------------------
    // TODAY
    // ---------------------------------------------------------

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    // ---------------------------------------------------------
    // FILTER UPCOMING INTERVIEWS
    // ---------------------------------------------------------

    const upcoming =
        interviews
            .filter(interview => {

                // ---------------------------------------------
                // STATUS
                // ---------------------------------------------

                const status =
                    String(
                        interview.status || ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    status !== "scheduled" &&
                    status !== "rescheduled"
                ) {

                    return false;

                }


                // ---------------------------------------------
                // DATE
                // ---------------------------------------------

                if (
                    !interview.interviewDate
                ) {

                    return false;

                }


                const interviewDate =
                    new Date(
                        interview.interviewDate
                    );


                if (
                    Number.isNaN(
                        interviewDate.getTime()
                    )
                ) {

                    return false;

                }


                interviewDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return interviewDate >= today;

            })


            // -------------------------------------------------
            // SORT BY INTERVIEW DATE
            // -------------------------------------------------

            .sort(
                (a, b) =>
                    new Date(
                        a.interviewDate
                    ) -
                    new Date(
                        b.interviewDate
                    )
            )


            // -------------------------------------------------
            // SHOW ONLY FIVE
            // -------------------------------------------------

            .slice(0, 5);


    console.log(
        "Upcoming Interviews:",
        upcoming
    );


    // ---------------------------------------------------------
    // NO UPCOMING INTERVIEWS
    // ---------------------------------------------------------

    if (upcoming.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="loading"
                >
                    No upcoming interviews.
                </td>
            </tr>
        `;

        return;
    }


    // ---------------------------------------------------------
    // DISPLAY UPCOMING INTERVIEWS
    // ---------------------------------------------------------

    upcoming.forEach(interview => {

        // ---------------------------------------------
        // FIND CANDIDATE
        // ---------------------------------------------

        const candidate =
            getCandidate(
                interview.candidateId
            );


        // ---------------------------------------------
        // CANDIDATE NAME
        // ---------------------------------------------

        const candidateName =
            getCandidateName(
                candidate
            );


        // ---------------------------------------------
        // DATE
        // ---------------------------------------------

        const date =
            formatDate(
                interview.interviewDate
            );


        // ---------------------------------------------
        // TIME
        // ---------------------------------------------

        const time =
            interview.interviewTime ||
            "-";


        // ---------------------------------------------
        // INTERVIEW TYPE
        // ---------------------------------------------

        const type =
            interview.interviewType ||
            "-";


        // ---------------------------------------------
        // INTERVIEWER
        // ---------------------------------------------

        const interviewer =
            interview.interviewer ||
            "-";


        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        const status =
            interview.status ||
            "Scheduled";


        // ---------------------------------------------
        // CREATE ROW
        // ---------------------------------------------

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="candidate-name">
                    ${escapeHTML(candidateName)}
                </span>

            </td>

            <td>

                ${escapeHTML(date)}

            </td>

            <td>

                ${escapeHTML(time)}

            </td>

            <td>

                ${escapeHTML(type)}

            </td>

            <td>

                ${escapeHTML(interviewer)}

            </td>

            <td>

                <span
                    class="status ${getStatusClass(status)}"
                >
                    ${escapeHTML(status)}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// ============================================================
// GET CANDIDATE
// ============================================================

function getCandidate(candidateId) {

    if (!candidateId) {
        return null;
    }


    // ---------------------------------------------------------
    // POPULATED CANDIDATE OBJECT
    // ---------------------------------------------------------

    if (
        typeof candidateId === "object"
    ) {

        return candidateId;

    }


    // ---------------------------------------------------------
    // FIND BY OBJECT ID
    // ---------------------------------------------------------

    return candidates.find(
        candidate =>
            String(candidate._id) ===
            String(candidateId)
    ) || null;
}


// ============================================================
// GET CANDIDATE NAME
// ============================================================

function getCandidateName(candidate) {

    if (!candidate) {

        return "Unknown Candidate";

    }


    return (

        candidate.name ||

        candidate.fullName ||

        `${candidate.firstName || ""} ${candidate.lastName || ""}`
            .trim() ||

        "Unknown Candidate"

    );
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";

    }


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(status) {

    return String(
        status || ""
    )
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// SET ELEMENT TEXT
// ============================================================

function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }
}