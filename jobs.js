const API_URL = "http://localhost:3000/api";

let allJobs = [];
let editingJobId = null;


// =========================================================
// DOM ELEMENTS
// =========================================================

const jobsTable = document.getElementById("jobsTable");

const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");

const jobModal = document.getElementById("jobModal");
const jobForm = document.getElementById("jobForm");

const formTitle = document.getElementById("formTitle");
const saveBtnText = document.getElementById("saveBtnText");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


// =========================================================
// LOAD JOB STATISTICS
// =========================================================

async function loadJobStats() {

    try {

        const response = await fetch(`${API_URL}/jobs/stats`);

        if (!response.ok) {
            throw new Error("Failed to load job statistics");
        }

        const stats = await response.json();

        document.getElementById("totalJobs").textContent =
            stats.totalJobs ?? 0;

        document.getElementById("activeJobs").textContent =
            stats.activeJobs ?? 0;

        document.getElementById("draftJobs").textContent =
            stats.draftJobs ?? 0;

        document.getElementById("closedJobs").textContent =
            stats.closedJobs ?? 0;

    } catch (error) {

        console.error("Error loading job statistics:", error);

        document.getElementById("totalJobs").textContent = "0";
        document.getElementById("activeJobs").textContent = "0";
        document.getElementById("draftJobs").textContent = "0";
        document.getElementById("closedJobs").textContent = "0";
    }
}


// =========================================================
// LOAD ALL JOBS
// =========================================================

async function loadJobs() {

    showLoading();

    try {

        const response = await fetch(`${API_URL}/jobs`);

        if (!response.ok) {
            throw new Error("Failed to fetch jobs");
        }

        const jobs = await response.json();

        allJobs = Array.isArray(jobs) ? jobs : [];

        renderJobs();

        // Refresh statistics
        loadJobStats();

    } catch (error) {

        console.error("Error loading jobs:", error);

        hideLoading();

        jobsTable.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    Unable to load jobs. Please check the server.
                </td>
            </tr>
        `;

        emptyState.classList.add("hidden");
    }
}


// =========================================================
// RENDER JOBS
// =========================================================

function renderJobs() {

    const searchValue =
        searchInput.value.trim().toLowerCase();

    const selectedStatus =
        statusFilter.value;

    const selectedType =
        typeFilter.value;

    const selectedSort =
        sortFilter.value;


    // -----------------------------------------------------
    // FILTER
    // -----------------------------------------------------

    let filteredJobs = allJobs.filter(job => {

        const title =
            (job.title || "").toLowerCase();

        const department =
            (job.department || "").toLowerCase();

        const location =
            (job.location || "").toLowerCase();

        const type =
            job.type || "";

        const status =
            job.status || "";


        const matchesSearch =
            title.includes(searchValue) ||
            department.includes(searchValue) ||
            location.includes(searchValue);


        const matchesStatus =
            selectedStatus === "All" ||
            status === selectedStatus;


        const matchesType =
            selectedType === "All" ||
            type === selectedType;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesType
        );

    });


    // -----------------------------------------------------
    // SORT
    // -----------------------------------------------------

    filteredJobs.sort((a, b) => {

        if (selectedSort === "newest") {

            return new Date(b.createdAt || 0) -
                   new Date(a.createdAt || 0);

        }


        if (selectedSort === "oldest") {

            return new Date(a.createdAt || 0) -
                   new Date(b.createdAt || 0);

        }


        if (selectedSort === "title") {

            return (a.title || "").localeCompare(
                b.title || ""
            );

        }


        return 0;

    });


    hideLoading();


    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    if (filteredJobs.length === 0) {

        jobsTable.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;

    }


    emptyState.classList.add("hidden");


    // -----------------------------------------------------
    // CREATE TABLE ROWS
    // -----------------------------------------------------

    jobsTable.innerHTML = filteredJobs.map(job => {

        const statusClass =
            (job.status || "Draft").toLowerCase();


        const createdDate =
            formatDate(job.createdAt);


        return `

            <tr>

                <!-- JOB TITLE -->

                <td>

                    <div class="job-title">

                        ${escapeHTML(job.title || "Untitled Job")}

                    </div>

                </td>


                <!-- DEPARTMENT -->

                <td>

                    <div class="job-department">

                        ${escapeHTML(job.department || "-")}

                    </div>

                </td>


                <!-- LOCATION -->

                <td>

                    <div class="job-location">

                        ${escapeHTML(job.location || "-")}

                    </div>

                </td>


                <!-- TYPE -->

                <td>

                    <div class="job-type">

                        ${escapeHTML(job.type || "-")}

                    </div>

                </td>


                <!-- EXPERIENCE -->

                <td>

                    <div class="job-experience">

                        ${escapeHTML(
                            job.experienceLevel || "-"
                        )}

                    </div>

                </td>


                <!-- STATUS -->

                <td>

                    <span class="status ${statusClass}">

                        ${escapeHTML(job.status || "Draft")}

                    </span>

                </td>


                <!-- CREATED -->

                <td>

                    <div class="job-experience">

                        ${createdDate}

                    </div>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="job-actions">

                        <button
                            type="button"
                            class="action-btn"
                            onclick="editJob('${job._id}')"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteJob('${job._id}')"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");

}


// =========================================================
// OPEN ADD JOB FORM
// =========================================================

function openJobForm() {

    editingJobId = null;

    formTitle.textContent =
        "Add New Job";

    saveBtnText.textContent =
        "Add Job";

    jobForm.reset();

    document.getElementById("jobId").value = "";

    jobModal.classList.remove("hidden");

}


// =========================================================
// CLOSE JOB FORM
// =========================================================

function closeJobForm() {

    jobModal.classList.add("hidden");

    editingJobId = null;

}


// =========================================================
// EDIT JOB
// =========================================================

async function editJob(jobId) {

    try {

        const response =
            await fetch(`${API_URL}/jobs/${jobId}`);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch job details"
            );

        }


        const job =
            await response.json();


        editingJobId =
            job._id;


        formTitle.textContent =
            "Edit Job";


        saveBtnText.textContent =
            "Update Job";


        document.getElementById("jobId").value =
            job._id || "";


        document.getElementById("title").value =
            job.title || "";


        document.getElementById("department").value =
            job.department || "";


        document.getElementById("location").value =
            job.location || "";


        document.getElementById("type").value =
            job.type || "Full-Time";


        document.getElementById("experienceLevel").value =
            job.experienceLevel || "";


        document.getElementById("salaryRange").value =
            job.salaryRange || "";


        document.getElementById("status").value =
            job.status || "Draft";


        document.getElementById("description").value =
            job.description || "";


        document.getElementById("responsibilities").value =
            Array.isArray(job.responsibilities)
                ? job.responsibilities.join(", ")
                : (job.responsibilities || "");


        document.getElementById("skills").value =
            Array.isArray(job.skills)
                ? job.skills.join(", ")
                : (job.skills || "");


        jobModal.classList.remove("hidden");


    } catch (error) {

        console.error(
            "Error loading job:",
            error
        );

        showToast(
            "Unable to load job details."
        );

    }

}


// =========================================================
// SAVE / UPDATE JOB
// =========================================================

jobForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // -------------------------------------------------
        // COLLECT FORM DATA
        // -------------------------------------------------

        const jobData = {

            title:
                document.getElementById("title").value.trim(),

            department:
                document.getElementById("department").value.trim(),

            location:
                document.getElementById("location").value.trim(),

            type:
                document.getElementById("type").value,

            experienceLevel:
                document
                    .getElementById("experienceLevel")
                    .value
                    .trim(),

            salaryRange:
                document
                    .getElementById("salaryRange")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            responsibilities:
                document
                    .getElementById("responsibilities")
                    .value
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item !== ""),

            skills:
                document
                    .getElementById("skills")
                    .value
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item !== ""),

            status:
                document.getElementById("status").value

        };


        try {

            let response;


            // -------------------------------------------------
            // UPDATE EXISTING JOB
            // -------------------------------------------------

            if (editingJobId) {

                response =
                    await fetch(
                        `${API_URL}/jobs/${editingJobId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(jobData)
                        }
                    );

            }


            // -------------------------------------------------
            // CREATE NEW JOB
            // -------------------------------------------------

            else {

                response =
                    await fetch(
                        `${API_URL}/jobs`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(jobData)
                        }
                    );

            }


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Server error:",
                    data
                );

                showToast(
                    data.message ||
                    "Unable to save job."
                );

                return;

            }


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            showToast(
                editingJobId
                    ? "Job updated successfully!"
                    : "Job created successfully!"
            );


            closeJobForm();


            // Reload both jobs and statistics

            await loadJobs();

            await loadJobStats();


        } catch (error) {

            console.error(
                "Error saving job:",
                error
            );

            showToast(
                "Unable to connect to server."
            );

        }

    }
);


// =========================================================
// DELETE JOB
// =========================================================

async function deleteJob(jobId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/jobs/${jobId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showToast(
                data.message ||
                "Unable to delete job."
            );

            return;

        }


        showToast(
            "Job deleted successfully!"
        );


        await loadJobs();

        await loadJobStats();


    } catch (error) {

        console.error(
            "Error deleting job:",
            error
        );

        showToast(
            "Unable to connect to server."
        );

    }

}


// =========================================================
// SEARCH
// =========================================================

searchInput.addEventListener(
    "input",
    renderJobs
);


// =========================================================
// STATUS FILTER
// =========================================================

statusFilter.addEventListener(
    "change",
    renderJobs
);


// =========================================================
// TYPE FILTER
// =========================================================

typeFilter.addEventListener(
    "change",
    renderJobs
);


// =========================================================
// SORT
// =========================================================

sortFilter.addEventListener(
    "change",
    renderJobs
);


// =========================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =========================================================

jobModal.addEventListener(
    "click",
    function (event) {

        if (event.target === jobModal) {

            closeJobForm();

        }

    }
);


// =========================================================
// ESCAPE KEY CLOSES MODAL
// =========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !jobModal.classList.contains("hidden")
        ) {

            closeJobForm();

        }

    }
);


// =========================================================
// LOADING STATE
// =========================================================

function showLoading() {

    loadingState.classList.remove("hidden");

    emptyState.classList.add("hidden");

    jobsTable.innerHTML = "";

}


function hideLoading() {

    loadingState.classList.add("hidden");

}


// =========================================================
// TOAST
// =========================================================

function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================================
// HTML ESCAPE
// Prevents unsafe HTML from being inserted
// =========================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// INITIAL LOAD
// =========================================================

loadJobs();
loadJobStats();