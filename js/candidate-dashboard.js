// =====================================================
// HIRE FLOW - CANDIDATE DASHBOARD
// =====================================================


// ===============================
// API BASE URL
// ===============================

const API_URL = "http://localhost:3000";


// ===============================
// GET LOGGED-IN USER
// ===============================

const user = JSON.parse(
    localStorage.getItem("hireflowUser")
);


// ===============================
// GET JWT TOKEN
// ===============================

const token =
    localStorage.getItem("hireflowToken");


// ===============================
// CHECK LOGIN
// ===============================

if (!user || !token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// ===============================
// CHECK CANDIDATE ROLE
// ===============================

if (user && user.role !== "candidate") {

    alert("Access denied. Candidate account required.");

    window.location.href = "index.html";

}


// ===============================
// DOM ELEMENTS
// ===============================

const profileName =
    document.getElementById("profileName");

const welcomeName =
    document.getElementById("welcomeName");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileLargeAvatar =
    document.getElementById("profileLargeAvatar");

const profileDetailsName =
    document.getElementById("profileDetailsName");

const profileEmail =
    document.getElementById("profileEmail");

const availableJobsCount =
    document.getElementById("availableJobsCount");

const applicationCount =
    document.getElementById("applicationCount");

const dashboardJobs =
    document.getElementById("dashboardJobs");

const jobsContainer =
    document.getElementById("jobsContainer");

const applicationsContainer =
    document.getElementById("applicationsContainer");

const applyModal =
    document.getElementById("applyModal");

const applicationForm =
    document.getElementById("applicationForm");

const applicationJobId =
    document.getElementById("applicationJobId");

const applyJobTitle =
    document.getElementById("applyJobTitle");

const coverLetter =
    document.getElementById("coverLetter");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ===============================
// DISPLAY USER INFORMATION
// ===============================

if (user) {

    const name =
        user.name || "Candidate";

    const firstLetter =
        name.charAt(0).toUpperCase();


    profileName.textContent =
        name;

    welcomeName.textContent =
        name;

    profileDetailsName.textContent =
        name;

    profileEmail.textContent =
        user.email || "-";

    profileAvatar.textContent =
        firstLetter;

    profileLargeAvatar.textContent =
        firstLetter;

}


// ===============================
// FETCH ACTIVE JOBS
// ===============================

async function loadJobs() {

    try {

        const response =
            await fetch(`${API_URL}/api/jobs`);

        if (!response.ok) {

            throw new Error(
                "Failed to fetch jobs"
            );

        }


        const jobs =
            await response.json();


        // Only Active jobs for candidates

        const activeJobs =
            jobs.filter(
                job => job.status === "Active"
            );


        availableJobsCount.textContent =
            activeJobs.length;


        renderJobs(
            activeJobs,
            dashboardJobs,
            3
        );


        renderJobs(
            activeJobs,
            jobsContainer
        );


    } catch (error) {

        console.error(
            "Load jobs error:",
            error
        );


        dashboardJobs.innerHTML =
            `<p class="error-message">
                Failed to load jobs.
            </p>`;


        jobsContainer.innerHTML =
            `<p class="error-message">
                Failed to load jobs.
            </p>`;

    }

}


// ===============================
// RENDER JOB CARDS
// ===============================

function renderJobs(
    jobs,
    container,
    limit = null
) {

    if (!jobs.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div>
                    💼
                </div>

                <h3>
                    No active jobs
                </h3>

                <p>
                    There are currently no open positions.
                </p>

            </div>

        `;

        return;

    }


    const jobsToShow =
        limit
            ? jobs.slice(0, limit)
            : jobs;


    container.innerHTML =
        jobsToShow.map(job => `

            <div class="job-card">

                <div class="job-card-top">

                    <div class="job-icon">
                        💼
                    </div>

                    <span class="job-status">
                        ${job.status}
                    </span>

                </div>


                <h3>
                    ${escapeHtml(job.title)}
                </h3>


                <p class="job-department">
                    ${escapeHtml(job.department)}
                </p>


                <div class="job-info">

                    <span>
                        📍 ${escapeHtml(job.location)}
                    </span>

                    <span>
                        💼 ${escapeHtml(job.type)}
                    </span>

                </div>


                <div class="job-experience">

                    Experience:
                    ${escapeHtml(job.experienceLevel)}

                </div>


                <div class="job-salary">

                    ${escapeHtml(job.salaryRange)}

                </div>


                <button
                    class="apply-btn"
                    data-job-id="${job._id}"
                    data-job-title="${escapeAttribute(job.title)}"
                >
                    Apply Now
                </button>

            </div>

        `).join("");


    // Add click events

    container
        .querySelectorAll(".apply-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openApplyModal(
                        button.dataset.jobId,
                        button.dataset.jobTitle
                    );

                }
            );

        });

}


// ===============================
// LOAD MY APPLICATIONS
// ===============================

async function loadApplications() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/applications/my`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch applications"
            );

        }


        const applications =
            await response.json();


        applicationCount.textContent =
            applications.length;


        renderApplications(
            applications
        );


    } catch (error) {

        console.error(
            "Load applications error:",
            error
        );


        applicationsContainer.innerHTML =
            `<p class="error-message">
                Failed to load applications.
            </p>`;

    }

}


// ===============================
// RENDER APPLICATIONS
// ===============================

function renderApplications(
    applications
) {

    if (!applications.length) {

        applicationsContainer.innerHTML = `

            <div class="empty-state">

                <div>
                    📄
                </div>

                <h3>
                    No applications yet
                </h3>

                <p>
                    Apply for a job to see it here.
                </p>

            </div>

        `;

        return;

    }


    applicationsContainer.innerHTML =
        applications.map(application => {

            const job =
                application.job;


            return `

                <div class="application-card">

                    <div>

                        <h3>
                            ${escapeHtml(
                                job?.title || "Job"
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                job?.department || "-"
                            )}
                        </p>

                        <span>
                            📍
                            ${escapeHtml(
                                job?.location || "-"
                            )}
                        </span>

                    </div>


                    <div class="application-status">

                        <span class="status-badge ${getStatusClass(application.status)}">
                            ${escapeHtml(
                                application.status
                            )}
                        </span>


                        <small>

                            Applied:
                            ${formatDate(
                                application.createdAt
                            )}

                        </small>

                    </div>

                </div>

            `;

        }).join("");

}


// ===============================
// OPEN APPLY MODAL
// ===============================

function openApplyModal(
    jobId,
    jobTitle
) {

    applicationJobId.value =
        jobId;

    applyJobTitle.textContent =
        jobTitle;

    coverLetter.value = "";

    applyModal.classList.remove(
        "hidden"
    );

}


// ===============================
// CLOSE APPLY MODAL
// ===============================

function closeApplyModal() {

    applyModal.classList.add(
        "hidden"
    );

}


// ===============================
// SUBMIT APPLICATION
// ===============================

applicationForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const jobId =
            applicationJobId.value;


        const letter =
            coverLetter.value.trim();


        if (!jobId) {

            showToast(
                "Job information is missing."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/applications`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            jobId: jobId,

                            coverLetter: letter

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to submit application"
                );

            }


            showToast(
                "Application submitted successfully!"
            );


            closeApplyModal();


            // Refresh data

            await loadApplications();

            await loadJobs();


        } catch (error) {

            console.error(
                "Apply error:",
                error
            );


            showToast(
                error.message
            );

        }

    }
);


// ===============================
// NAVIGATION
// ===============================

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const sections = {

    dashboard:
        document.getElementById(
            "dashboardSection"
        ),

    jobs:
        document.getElementById(
            "jobsSection"
        ),

    applications:
        document.getElementById(
            "applicationsSection"
        ),

    interviews:
        document.getElementById(
            "interviewsSection"
        ),

    profile:
        document.getElementById(
            "profileSection"
        )

};


function showSection(
    sectionName
) {

    Object.values(sections)
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    if (sections[sectionName]) {

        sections[sectionName]
            .classList.add(
                "active-section"
            );

    }


    navItems.forEach(item => {

        item.classList.remove(
            "active"
        );


        if (
            item.dataset.section ===
            sectionName
        ) {

            item.classList.add(
                "active"
            );

        }

    });


    const titles = {

        dashboard:
            [
                "Candidate Dashboard",
                "Find your next opportunity and track your applications."
            ],

        jobs:
            [
                "Browse Jobs",
                "Find a position that matches your skills."
            ],

        applications:
            [
                "My Applications",
                "Track the jobs you have applied for."
            ],

        interviews:
            [
                "My Interviews",
                "View your scheduled interviews."
            ],

        profile:
            [
                "My Profile",
                "Your HireFlow account information."
            ]

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[sectionName][0];


    document.getElementById(
        "pageDescription"
    ).textContent =
        titles[sectionName][1];

}


// Navigation click

navItems.forEach(item => {

    item.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showSection(
                item.dataset.section
            );

        }
    );

});


// View All buttons

document
    .querySelectorAll(
        "[data-section]"
    )
    .forEach(button => {

        if (
            button.classList.contains(
                "nav-item"
            )
        ) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                showSection(
                    button.dataset.section
                );

            }
        );

    });


// ===============================
// MODAL BUTTONS
// ===============================

document
    .getElementById(
        "closeApplyModal"
    )
    .addEventListener(
        "click",
        closeApplyModal
    );


document
    .getElementById(
        "cancelApply"
    )
    .addEventListener(
        "click",
        closeApplyModal
    );


applyModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            applyModal
        ) {

            closeApplyModal();

        }

    }
);


// ===============================
// LOGOUT
// ===============================

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "hireflowToken"
            );

            localStorage.removeItem(
                "hireflowUser"
            );


            window.location.href =
                "login.html";

        }
    );


// ===============================
// TOAST
// ===============================

function showToast(
    message
) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(
    date
) {

    if (!date) {
        return "-";
    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ===============================
// STATUS CLASS
// ===============================

function getStatusClass(
    status
) {

    return status
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

}


// ===============================
// HTML ESCAPE
// ===============================

function escapeHtml(
    value
) {

    if (value === null ||
        value === undefined) {

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


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


// ===============================
// INITIAL LOAD
// ===============================

loadJobs();

loadApplications();