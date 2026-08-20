const API_URL = "http://localhost:5000/api";

let editingJobId = null;


// ===============================
// LOAD ALL JOBS
// ===============================

async function loadJobs() {

    try {

        const response = await fetch(`${API_URL}/jobs`);
        const jobs = await response.json();

        const table = document.getElementById("jobsTable");

        table.innerHTML = "";


        if (jobs.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        No jobs found.
                    </td>
                </tr>
            `;

            return;
        }


        jobs.forEach(job => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>
                    <strong>${job.title}</strong>
                </td>

                <td>
                    ${job.department}
                </td>

                <td>
                    ${job.location}
                </td>

                <td>
                    ${job.type}
                </td>

                <td>
                    <span class="status ${job.status.toLowerCase()}">
                        ${job.status}
                    </span>
                </td>

                <td>

                    <button
                        class="action-btn"
                        onclick='editJob(${JSON.stringify(job)})'>
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteJob('${job._id}')">
                        Delete
                    </button>

                </td>

            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading jobs:", error);

    }

}


// ===============================
// OPEN ADD JOB FORM
// ===============================

function openJobForm() {

    editingJobId = null;

    document.getElementById("formTitle").textContent =
        "Add New Job";

    document.getElementById("jobForm").reset();

    document.getElementById("jobModal").style.display =
        "flex";

}


// ===============================
// CLOSE FORM
// ===============================

function closeJobForm() {

    document.getElementById("jobModal").style.display =
        "none";

}


// ===============================
// EDIT JOB
// ===============================

function editJob(job) {

    editingJobId = job._id;

    document.getElementById("formTitle").textContent =
        "Edit Job";


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

    document.getElementById("description").value =
        job.description || "";


    document.getElementById("responsibilities").value =
        (job.responsibilities || []).join(", ");


    document.getElementById("skills").value =
        (job.skills || []).join(", ");


    document.getElementById("status").value =
        job.status || "Draft";


    document.getElementById("jobModal").style.display =
        "flex";

}


// ===============================
// SAVE JOB
// ===============================

document.getElementById("jobForm").addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const jobData = {

            title:
                document.getElementById("title").value,

            department:
                document.getElementById("department").value,

            location:
                document.getElementById("location").value,

            type:
                document.getElementById("type").value,

            experienceLevel:
                document.getElementById("experienceLevel").value,

            salaryRange:
                document.getElementById("salaryRange").value,

            description:
                document.getElementById("description").value,

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


            // UPDATE
            if (editingJobId) {

                response = await fetch(
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

            // CREATE
            else {

                response = await fetch(
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


            const data = await response.json();


            if (!response.ok) {
                alert("Unable to save job. Please check the entered details.");
                return;
            }


            alert(
                editingJobId
                    ? "Job updated successfully!"
                    : "Job created successfully!"
            );


            closeJobForm();

            loadJobs();

        } catch (error) {

            console.error(error);

            alert("Unable to connect to server.");

        }

    }
);


// ===============================
// DELETE JOB
// ===============================

async function deleteJob(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this job?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/jobs/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {
            alert("Unable to delete job. Please try again.");
            return;
        }


        alert("Job deleted successfully!");

        loadJobs();


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

}


// ===============================
// INITIAL LOAD
// ===============================

loadJobs();