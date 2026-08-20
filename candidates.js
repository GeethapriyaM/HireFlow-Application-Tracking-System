const API_URL = "http://localhost:3000/api/candidates";

let candidates = [];


// ==========================================
// DOM ELEMENTS
// ==========================================

const tableBody = document.getElementById("candidateTableBody");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const positionFilter = document.getElementById("positionFilter");
const sortFilter = document.getElementById("sortFilter");

const candidateModal = document.getElementById("candidateModal");
const detailsModal = document.getElementById("detailsModal");
const candidateForm = document.getElementById("candidateForm");


// ==========================================
// LOAD CANDIDATES
// ==========================================

async function loadCandidates() {

    showLoading();

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch candidates");
        }

        candidates = await response.json();

        console.log("Candidates loaded:", candidates);

        updateStatistics();
        populatePositionFilter();
        renderCandidates();

    } catch (error) {

        console.error("Candidate loading error:", error);

        tableBody.innerHTML = "";

        emptyState.classList.remove("hidden");

        emptyState.querySelector("h3").textContent =
            "Unable to load candidates";

        emptyState.querySelector("p").textContent =
            "Please check whether HireFlow server is running.";

        showToast("Unable to load candidates");

    } finally {

        loadingState.classList.add("hidden");
    }
}


// ==========================================
// GET POSITION
// ==========================================

function getPosition(candidate) {

    return (
        candidate.position ||
        candidate.jobRole ||
        "-"
    );
}


// ==========================================
// GET EXPERIENCE
// ==========================================

function getExperience(candidate) {

    if (
        candidate.experienceYears !== undefined &&
        candidate.experienceYears !== null
    ) {
        return candidate.experienceYears;
    }

    return candidate.experience || 0;
}


// ==========================================
// NORMALIZE SKILLS
// ==========================================

function getSkills(candidate) {

    if (!Array.isArray(candidate.skills)) {
        return [];
    }

    return candidate.skills
        .map(skill => {

            return String(skill)
                .replace(/^\[/, "")
                .replace(/\]$/, "")
                .replace(/^["']|["']$/g, "")
                .trim();

        })
        .filter(Boolean);
}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    document.getElementById("totalCandidates").textContent =
        candidates.length;

    document.getElementById("appliedCandidates").textContent =
        countStatus("Applied");

    document.getElementById("screeningCandidates").textContent =
        countStatus("Screening");

    document.getElementById("interviewCandidates").textContent =
        countStatus("Interview");

    document.getElementById("selectedCandidates").textContent =
        countStatus("Selected");
}


function countStatus(status) {

    return candidates.filter(candidate => {

        return (
            candidate.status || "Applied"
        ).toLowerCase() === status.toLowerCase();

    }).length;
}


// ==========================================
// POSITION FILTER
// ==========================================

function populatePositionFilter() {

    const positions = [
        ...new Set(

            candidates
                .map(candidate => getPosition(candidate))
                .filter(position => position !== "-")

        )
    ];

    positionFilter.innerHTML =
        `<option value="All">All Positions</option>`;

    positions
        .sort()
        .forEach(position => {

            const option =
                document.createElement("option");

            option.value = position;

            option.textContent = position;

            positionFilter.appendChild(option);

        });
}


// ==========================================
// RENDER CANDIDATES
// ==========================================

function renderCandidates() {

    let filteredCandidates = [...candidates];

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const status =
        statusFilter.value;

    const position =
        positionFilter.value;


    // --------------------------------------
    // SEARCH
    // --------------------------------------

    if (search) {

        filteredCandidates =
            filteredCandidates.filter(candidate => {

                const skills =
                    getSkills(candidate).join(" ");

                const candidatePosition =
                    getPosition(candidate);

                return (

                    (candidate.name || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (candidate.email || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    candidatePosition
                        .toLowerCase()
                        .includes(search)

                    ||

                    skills
                        .toLowerCase()
                        .includes(search)

                    ||

                    (candidate.location || "")
                        .toLowerCase()
                        .includes(search)

                );

            });
    }


    // --------------------------------------
    // STATUS FILTER
    // --------------------------------------

    if (status !== "All") {

        filteredCandidates =
            filteredCandidates.filter(candidate => {

                return (
                    candidate.status || "Applied"
                ).toLowerCase() === status.toLowerCase();

            });
    }


    // --------------------------------------
    // POSITION FILTER
    // --------------------------------------

    if (position !== "All") {

        filteredCandidates =
            filteredCandidates.filter(candidate => {

                return getPosition(candidate) === position;

            });
    }


    // --------------------------------------
    // SORT
    // --------------------------------------

    const sort = sortFilter.value;

    if (sort === "newest") {

        filteredCandidates.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

    }

    else if (sort === "oldest") {

        filteredCandidates.sort(
            (a, b) =>
                new Date(a.createdAt || 0) -
                new Date(b.createdAt || 0)
        );

    }

    else if (sort === "name") {

        filteredCandidates.sort(
            (a, b) =>
                (a.name || "").localeCompare(
                    b.name || ""
                )
        );
    }


    // --------------------------------------
    // DISPLAY
    // --------------------------------------

    tableBody.innerHTML = "";

    if (filteredCandidates.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");


    filteredCandidates.forEach(candidate => {

        tableBody.appendChild(
            createCandidateRow(candidate)
        );

    });
}


// ==========================================
// CREATE TABLE ROW
// ==========================================

function createCandidateRow(candidate) {

    const row =
        document.createElement("tr");

    const initials =
        getInitials(candidate.name);

    const skills =
        getSkills(candidate);

    const visibleSkills =
        skills.slice(0, 2);

    let skillsHTML =
        visibleSkills
            .map(skill => {

                return `
                    <span class="skill">
                        ${escapeHTML(skill)}
                    </span>
                `;

            })
            .join("");


    if (skills.length > 2) {

        skillsHTML += `
            <span class="skill more">
                +${skills.length - 2}
            </span>
        `;
    }


    const status =
        candidate.status || "Applied";

    const statusClass =
        status.toLowerCase();

    const position =
        getPosition(candidate);

    const experience =
        getExperience(candidate);


    row.innerHTML = `

        <td>

            <div class="candidate-info">

                <div class="avatar">
                    ${initials}
                </div>

                <div>

                    <div class="candidate-name">
                        ${escapeHTML(
                            candidate.name || "Unknown"
                        )}
                    </div>

                    <div class="candidate-email">
                        ${escapeHTML(
                            candidate.email || "-"
                        )}
                    </div>

                </div>

            </div>

        </td>


        <td>

            <div class="position">
                ${escapeHTML(position)}
            </div>

        </td>


        <td>

            <div class="experience">
                ${experience} years
            </div>

        </td>


        <td>

            <div class="skills">

                ${
                    skillsHTML ||
                    `<span class="skill">
                        No skills
                    </span>`
                }

            </div>

        </td>


        <td>

            <div class="location">
                ${escapeHTML(
                    candidate.location || "-"
                )}
            </div>

        </td>


        <td>

            <span class="status ${statusClass}">
                ${escapeHTML(status)}
            </span>

        </td>


        <td>

            ${formatDate(
                candidate.createdAt ||
                candidate.appliedDate
            )}

        </td>


        <td>

            <button
                class="action-btn"
                title="View candidate"
                onclick="showCandidateDetails('${candidate._id}')"
            >
                ⋮
            </button>

        </td>

    `;


    return row;
}


// ==========================================
// ADD CANDIDATE
// ==========================================

document
    .getElementById("openAddCandidate")
    .addEventListener("click", () => {

        openAddModal();

    });


function openAddModal() {

    candidateForm.reset();

    document.getElementById("candidateId").value = "";

    document.getElementById("modalTitle").textContent =
        "Add New Candidate";

    document.getElementById("saveBtnText").textContent =
        "Add Candidate";

    candidateModal.classList.remove("hidden");
}


// ==========================================
// CLOSE ADD MODAL
// ==========================================

document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeCandidateModal
    );


document
    .getElementById("cancelModal")
    .addEventListener(
        "click",
        closeCandidateModal
    );


function closeCandidateModal() {

    candidateModal.classList.add("hidden");
}


// ==========================================
// SUBMIT CANDIDATE
// ==========================================

candidateForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document
                .getElementById("candidateId")
                .value;


        const skillsValue =
            document
                .getElementById("candidateSkills")
                .value;


        const candidateData = {

            name:
                document
                    .getElementById("candidateName")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("candidateEmail")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("candidatePhone")
                    .value
                    .trim(),

            position:
                document
                    .getElementById("candidatePosition")
                    .value
                    .trim(),

            experience:
                Number(
                    document
                        .getElementById("candidateExperience")
                        .value
                ) || 0,

            location:
                document
                    .getElementById("candidateLocation")
                    .value
                    .trim(),

            status:
                document
                    .getElementById("candidateStatus")
                    .value,

            skills:
                skillsValue
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean),

            resume:
                document
                    .getElementById("candidateResume")
                    .value
                    .trim()
        };


        try {

            const response =
                await fetch(

                    id
                        ? `${API_URL}/${id}`
                        : API_URL,

                    {
                        method:
                            id
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                candidateData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Something went wrong"
                );
            }


            closeCandidateModal();


            showToast(
                id
                    ? "Candidate updated successfully"
                    : "Candidate added successfully"
            );


            await loadCandidates();


        } catch (error) {

            console.error(error);

            showToast(error.message);

        }

    }
);


// ==========================================
// SHOW DETAILS
// ==========================================

function showCandidateDetails(id) {

    const candidate =
        candidates.find(
            item => item._id === id
        );


    if (!candidate) {
        return;
    }


    const skills =
        getSkills(candidate);

    const position =
        getPosition(candidate);

    const experience =
        getExperience(candidate);

    const status =
        candidate.status || "Applied";


    const skillsHTML =
        skills.length

            ? skills
                .map(skill => {

                    return `
                        <span class="detail-skill">
                            ${escapeHTML(skill)}
                        </span>
                    `;

                })
                .join("")

            : `<span>No skills added</span>`;


    document.getElementById(
        "candidateDetails"
    ).innerHTML = `

        <div class="details-content">


            <div class="details-profile">

                <div class="details-avatar">
                    ${getInitials(candidate.name)}
                </div>


                <div>

                    <h2>
                        ${escapeHTML(
                            candidate.name || "Unknown"
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(position)}
                    </p>

                    <span class="status ${status.toLowerCase()}">
                        ${escapeHTML(status)}
                    </span>

                </div>

            </div>


            <div class="details-grid">


                <div class="detail-item">

                    <label>Email</label>

                    <strong>
                        ${escapeHTML(
                            candidate.email || "-"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Phone</label>

                    <strong>
                        ${escapeHTML(
                            candidate.phone || "-"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Position</label>

                    <strong>
                        ${escapeHTML(position)}
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Experience</label>

                    <strong>
                        ${experience} years
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Location</label>

                    <strong>
                        ${escapeHTML(
                            candidate.location || "-"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Source</label>

                    <strong>
                        ${escapeHTML(
                            candidate.source || "-"
                        )}
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Rating</label>

                    <strong>
                        ⭐ ${candidate.rating || 0}/5
                    </strong>

                </div>


                <div class="detail-item">

                    <label>Added</label>

                    <strong>
                        ${formatDate(
                            candidate.createdAt ||
                            candidate.appliedDate
                        )}
                    </strong>

                </div>

            </div>


            <div class="details-skills">

                <h4>Skills</h4>

                <div class="details-skills-container">

                    ${skillsHTML}

                </div>

            </div>


            <div class="modal-footer">

                <button
                    class="cancel-btn"
                    onclick="editCandidate('${candidate._id}')"
                >
                    Edit Candidate
                </button>


                <button
                    class="save-btn"
                    onclick="deleteCandidate('${candidate._id}')"
                >
                    Delete Candidate
                </button>

            </div>


        </div>

    `;


    detailsModal.classList.remove("hidden");
}


// ==========================================
// EDIT
// ==========================================

function editCandidate(id) {

    const candidate =
        candidates.find(
            item => item._id === id
        );


    if (!candidate) {
        return;
    }


    detailsModal.classList.add("hidden");


    document.getElementById("candidateId").value =
        candidate._id;


    document.getElementById("candidateName").value =
        candidate.name || "";


    document.getElementById("candidateEmail").value =
        candidate.email || "";


    document.getElementById("candidatePhone").value =
        candidate.phone || "";


    document.getElementById("candidatePosition").value =
        getPosition(candidate) === "-"
            ? ""
            : getPosition(candidate);


    document.getElementById("candidateExperience").value =
        getExperience(candidate);


    document.getElementById("candidateLocation").value =
        candidate.location || "";


    document.getElementById("candidateStatus").value =
        candidate.status || "Applied";


    document.getElementById("candidateSkills").value =
        getSkills(candidate).join(", ");


    document.getElementById("candidateResume").value =
        candidate.resume || "";


    document.getElementById("modalTitle").textContent =
        "Edit Candidate";


    document.getElementById("saveBtnText").textContent =
        "Save Changes";


    candidateModal.classList.remove("hidden");
}


// ==========================================
// DELETE
// ==========================================

async function deleteCandidate(id) {

    const candidate =
        candidates.find(
            item => item._id === id
        );


    if (!candidate) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${candidate.name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete candidate"
            );
        }


        detailsModal.classList.add("hidden");


        showToast(
            "Candidate deleted successfully"
        );


        await loadCandidates();


    } catch (error) {

        console.error(error);

        showToast(error.message);

    }
}


// ==========================================
// FILTER EVENTS
// ==========================================

searchInput.addEventListener(
    "input",
    renderCandidates
);


statusFilter.addEventListener(
    "change",
    renderCandidates
);


positionFilter.addEventListener(
    "change",
    renderCandidates
);


sortFilter.addEventListener(
    "change",
    renderCandidates
);


// ==========================================
// CLOSE DETAILS
// ==========================================

document
    .getElementById("closeDetailsModal")
    .addEventListener("click", () => {

        detailsModal.classList.add("hidden");

    });


detailsModal.addEventListener(
    "click",
    event => {

        if (event.target === detailsModal) {

            detailsModal.classList.add(
                "hidden"
            );

        }

    }
);


candidateModal.addEventListener(
    "click",
    event => {

        if (event.target === candidateModal) {

            closeCandidateModal();

        }

    }
);


// ==========================================
// HELPERS
// ==========================================

function getInitials(name) {

    if (!name) {
        return "NA";
    }


    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word =>
            word[0].toUpperCase()
        )
        .join("");
}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(date);


    if (isNaN(parsedDate)) {
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


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loadingState.classList.remove("hidden");

    emptyState.classList.add("hidden");

    tableBody.innerHTML = "";
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadCandidates();