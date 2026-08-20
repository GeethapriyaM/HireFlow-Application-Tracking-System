const API_URL =
    "http://localhost:3000/api/candidates";


// ==========================================
// ELEMENTS
// ==========================================

const tbody =
    document.getElementById(
        "candidatesTableBody"
    );

const candidateCount =
    document.getElementById(
        "candidateCount"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const jobRoleFilter =
    document.getElementById(
        "jobRoleFilter"
    );

const stageFilter =
    document.getElementById(
        "stageFilter"
    );

const skillFilter =
    document.getElementById(
        "skillFilter"
    );

const ratingFilter =
    document.getElementById(
        "ratingFilter"
    );

const selectAll =
    document.getElementById(
        "selectAllCandidates"
    );

const bulkStageSelect =
    document.getElementById(
        "bulkStageSelect"
    );

const bulkStageBtn =
    document.getElementById(
        "bulkStageBtn"
    );

const addCandidateBtn =
    document.getElementById(
        "addCandidateBtn"
    );

const candidateModal =
    document.getElementById(
        "candidateModal"
    );

const profileModal =
    document.getElementById(
        "profileModal"
    );

const editCandidateModal =
    document.getElementById(
        "editCandidateModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const closeProfile =
    document.getElementById(
        "closeProfile"
    );

const closeEditModal =
    document.getElementById(
        "closeEditModal"
    );

const candidateForm =
    document.getElementById(
        "candidateForm"
    );

const editCandidateForm =
    document.getElementById(
        "editCandidateForm"
    );


let candidates = [];

let selectedIds = new Set();


// ==========================================
// LOAD CANDIDATES
// ==========================================

async function loadCandidates() {

    try {

        const params =
            new URLSearchParams();


        const search =
            searchInput.value.trim();

        const jobRole =
            jobRoleFilter.value.trim();

        const stage =
            stageFilter.value;

        const skill =
            skillFilter.value.trim();

        const rating =
            ratingFilter.value;


        if (search) {

            params.append(
                "search",
                search
            );

        }


        if (jobRole) {

            params.append(
                "jobRole",
                jobRole
            );

        }


        if (stage) {

            params.append(
                "stage",
                stage
            );

        }


        if (skill) {

            params.append(
                "skill",
                skill
            );

        }


        if (rating !== "0") {

            params.append(
                "minRating",
                rating
            );

        }


        let url = API_URL;


        if (params.toString()) {

            url +=
                `?${params.toString()}`;

        }


        const response =
            await fetch(url);


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load candidates"
            );

        }


        candidates =
            Array.isArray(result)
                ? result
                : result.data || [];


        displayCandidates(
            candidates
        );


    } catch (error) {

        console.error(error);


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;padding:40px;"
                >
                    Unable to load candidates.
                </td>
            </tr>
        `;

    }
}


// ==========================================
// DISPLAY CANDIDATES
// ==========================================

function displayCandidates(list) {

    tbody.innerHTML = "";

    candidateCount.textContent =
        list.length;

    selectedIds.clear();

    selectAll.checked = false;


    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;padding:40px;"
                >
                    No candidates found.
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(candidate => {

        const tr =
            document.createElement("tr");


        const initials =
            (candidate.name || "?")
                .split(" ")
                .map(
                    word => word[0]
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();


        const rating =
            Number(
                candidate.rating
            ) || 0;


        const stars =
            "★".repeat(rating) +
            "☆".repeat(
                5 - rating
            );


        const appliedOn =
            candidate.appliedDate ||
            candidate.createdAt;


        const date =
            appliedOn
                ? new Date(
                    appliedOn
                ).toLocaleDateString(
                    "en-IN",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                )
                : "-";


        tr.innerHTML = `

            <td>

                <input
                    type="checkbox"
                    class="row-check"
                    data-id="${candidate._id}"
                >

            </td>


            <td>

                <div class="candidate-cell">

                    <div class="avatar">
                        ${initials}
                    </div>

                    <div>

                        <div class="candidate-name">
                            ${escapeHtml(
                                candidate.name
                            )}
                        </div>

                        <div class="candidate-email">
                            ${escapeHtml(
                                candidate.email
                            )}
                        </div>

                    </div>

                </div>

            </td>


            <td>

                <strong>
                    ${escapeHtml(
                        candidate.jobRole ||
                        "-"
                    )}
                </strong>

                <div class="candidate-email">
                    ${escapeHtml(
                        candidate.source ||
                        "Direct"
                    )}
                </div>

            </td>


            <td>

                <span
                    class="stage-badge stage-${candidate.stage}"
                >
                    ${candidate.stage || "Applied"}
                </span>

            </td>


            <td>

                <div class="stars">
                    ${stars}
                </div>

                <div class="experience">
                    ${
                        candidate.experienceYears ||
                        0
                    }
                    yrs experience
                </div>

            </td>


            <td>
                ${date}
            </td>


            <td>

                <div class="action-buttons">


                    <button
                        class="action-btn"
                        onclick="viewProfile(
                            '${candidate._id}'
                        )"
                    >
                        Profile
                    </button>


                    <button
                        class="action-btn"
                        onclick="openEditCandidate(
                            '${candidate._id}'
                        )"
                    >
                        Edit
                    </button>


                    <button
                        class="action-btn"
                        onclick="changeStage(
                            '${candidate._id}'
                        )"
                    >
                        Stage
                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteCandidate(
                            '${candidate._id}'
                        )"
                    >
                        🗑
                    </button>


                </div>

            </td>

        `;


        const checkbox =
            tr.querySelector(
                ".row-check"
            );


        checkbox.addEventListener(
            "change",
            () => {

                if (checkbox.checked) {

                    selectedIds.add(
                        candidate._id
                    );

                } else {

                    selectedIds.delete(
                        candidate._id
                    );

                }

            }
        );


        tbody.appendChild(tr);

    });
}


// ==========================================
// FILTER EVENTS
// ==========================================

searchInput.addEventListener(
    "input",
    loadCandidates
);

jobRoleFilter.addEventListener(
    "input",
    loadCandidates
);

skillFilter.addEventListener(
    "input",
    loadCandidates
);

stageFilter.addEventListener(
    "change",
    loadCandidates
);

ratingFilter.addEventListener(
    "change",
    loadCandidates
);


// ==========================================
// SELECT ALL
// ==========================================

selectAll.addEventListener(
    "change",
    () => {

        const checkboxes =
            document.querySelectorAll(
                ".row-check"
            );


        checkboxes.forEach(
            checkbox => {

                checkbox.checked =
                    selectAll.checked;


                if (
                    selectAll.checked
                ) {

                    selectedIds.add(
                        checkbox.dataset.id
                    );

                } else {

                    selectedIds.delete(
                        checkbox.dataset.id
                    );

                }

            }
        );

    }
);


// ==========================================
// ADD CANDIDATE MODAL
// ==========================================

addCandidateBtn.addEventListener(
    "click",
    () => {

        candidateModal.style.display =
            "flex";

    }
);


closeModal.addEventListener(
    "click",
    () => {

        candidateModal.style.display =
            "none";

    }
);


// ==========================================
// CREATE CANDIDATE
// ==========================================

candidateForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const skills =
            document.getElementById(
                "skills"
            ).value
                .split(",")
                .map(
                    skill =>
                        skill.trim()
                )
                .filter(Boolean);


        const candidate = {

            name:
                document.getElementById(
                    "name"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value,

            phone:
                document.getElementById(
                    "phone"
                ).value,

            jobRole:
                document.getElementById(
                    "jobRole"
                ).value,

            currentCompany:
                document.getElementById(
                    "currentCompany"
                ).value,

            experienceYears:
                Number(
                    document.getElementById(
                        "experienceYears"
                    ).value
                ) || 0,

            qualification:
                document.getElementById(
                    "qualification"
                ).value,

            yop:
                Number(
                    document.getElementById(
                        "yop"
                    ).value
                ) || null,

            education:
                document.getElementById(
                    "education"
                ).value,

            linkedin:
                document.getElementById(
                    "linkedin"
                ).value,

            portfolio:
                document.getElementById(
                    "portfolio"
                ).value,

            skills,

            source:
                document.getElementById(
                    "source"
                ).value,

            stage:
                document.getElementById(
                    "stage"
                ).value,

            rating:
                Number(
                    document.getElementById(
                        "rating"
                    ).value
                ),

            coverLetter:
                document.getElementById(
                    "coverLetter"
                ).value

        };


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                candidate
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to create candidate"
                );

                return;
            }


            alert(
                "Candidate added successfully"
            );


            candidateForm.reset();

            candidateModal.style.display =
                "none";


            loadCandidates();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to create candidate"
            );

        }

    }
);


// ==========================================
// VIEW PROFILE
// ==========================================

async function viewProfile(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const candidate =
            await response.json();


        if (!response.ok) {

            alert(
                candidate.message ||
                "Candidate not found"
            );

            return;
        }


        document.getElementById(
            "profileName"
        ).textContent =
            candidate.name;


        const rating =
            Number(
                candidate.rating
            ) || 0;


        const stars =
            "★".repeat(rating) +
            "☆".repeat(
                5 - rating
            );


        document.getElementById(
            "profileContent"
        ).innerHTML = `

            <div class="profile-grid">


                <div class="profile-item">

                    <strong>
                        Email
                    </strong>

                    ${escapeHtml(
                        candidate.email
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Phone
                    </strong>

                    ${escapeHtml(
                        candidate.phone ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Job Role
                    </strong>

                    ${escapeHtml(
                        candidate.jobRole ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Current Company
                    </strong>

                    ${escapeHtml(
                        candidate.currentCompany ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Experience
                    </strong>

                    ${
                        candidate.experienceYears ||
                        0
                    }
                    years

                </div>


                <div class="profile-item">

                    <strong>
                        Qualification
                    </strong>

                    ${escapeHtml(
                        candidate.qualification ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Year of Passing
                    </strong>

                    ${
                        candidate.yop ||
                        "-"
                    }

                </div>


                <div class="profile-item">

                    <strong>
                        Education
                    </strong>

                    ${escapeHtml(
                        candidate.education ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Source
                    </strong>

                    ${escapeHtml(
                        candidate.source ||
                        "-"
                    )}

                </div>


                <div class="profile-item">

                    <strong>
                        Stage
                    </strong>

                    ${candidate.stage}

                </div>


                <div class="profile-item">

                    <strong>
                        Rating
                    </strong>

                    ${stars}

                </div>


                <div class="profile-item">

                    <strong>
                        Applied On
                    </strong>

                    ${
                        candidate.appliedDate
                            ? new Date(
                                candidate.appliedDate
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "-"
                    }

                </div>


                <div class="profile-item">

                    <strong>
                        LinkedIn
                    </strong>

                    ${
                        candidate.linkedin
                            ? `<a
                                href="${escapeHtml(
                                    candidate.linkedin
                                )}"
                                target="_blank"
                            >
                                View LinkedIn
                            </a>`
                            : "-"
                    }

                </div>


                <div class="profile-item">

                    <strong>
                        Portfolio
                    </strong>

                    ${
                        candidate.portfolio
                            ? `<a
                                href="${escapeHtml(
                                    candidate.portfolio
                                )}"
                                target="_blank"
                            >
                                View Portfolio
                            </a>`
                            : "-"
                    }

                </div>

            </div>


            <div
                class="profile-item"
                style="margin-top:16px;"
            >

                <strong>
                    Skills
                </strong>


                <div class="profile-skills">

                    ${
                        (
                            candidate.skills ||
                            []
                        )
                        .map(
                            skill => `
                                <span class="skill-tag">
                                    ${escapeHtml(
                                        skill
                                    )}
                                </span>
                            `
                        )
                        .join("")
                    }

                </div>

            </div>

        `;


        profileModal.style.display =
            "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load candidate profile"
        );

    }
}


closeProfile.addEventListener(
    "click",
    () => {

        profileModal.style.display =
            "none";

    }
);


// ==========================================
// EDIT CANDIDATE
// ==========================================

async function openEditCandidate(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const candidate =
            await response.json();


        if (!response.ok) {

            alert(
                candidate.message ||
                "Candidate not found"
            );

            return;
        }


        document.getElementById(
            "editCandidateId"
        ).value =
            candidate._id;


        document.getElementById(
            "editName"
        ).value =
            candidate.name || "";


        document.getElementById(
            "editEmail"
        ).value =
            candidate.email || "";


        document.getElementById(
            "editPhone"
        ).value =
            candidate.phone || "";


        document.getElementById(
            "editJobRole"
        ).value =
            candidate.jobRole || "";


        document.getElementById(
            "editCurrentCompany"
        ).value =
            candidate.currentCompany || "";


        document.getElementById(
            "editExperienceYears"
        ).value =
            candidate.experienceYears || 0;


        document.getElementById(
            "editQualification"
        ).value =
            candidate.qualification || "";


        document.getElementById(
            "editYop"
        ).value =
            candidate.yop || "";


        document.getElementById(
            "editEducation"
        ).value =
            candidate.education || "";


        document.getElementById(
            "editLinkedin"
        ).value =
            candidate.linkedin || "";


        document.getElementById(
            "editPortfolio"
        ).value =
            candidate.portfolio || "";


        document.getElementById(
            "editSkills"
        ).value =
            (
                candidate.skills ||
                []
            ).join(", ");


        document.getElementById(
            "editSource"
        ).value =
            candidate.source ||
            "Careers Portal";


        document.getElementById(
            "editStage"
        ).value =
            candidate.stage ||
            "Applied";


        document.getElementById(
            "editRating"
        ).value =
            candidate.rating || 0;


        document.getElementById(
            "editCoverLetter"
        ).value =
            candidate.coverLetter || "";


        editCandidateModal.style.display =
            "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load candidate"
        );

    }
}


closeEditModal.addEventListener(
    "click",
    () => {

        editCandidateModal.style.display =
            "none";

    }
);


editCandidateForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            document.getElementById(
                "editCandidateId"
            ).value;


        const skills =
            document.getElementById(
                "editSkills"
            ).value
                .split(",")
                .map(
                    skill =>
                        skill.trim()
                )
                .filter(Boolean);


        const updatedCandidate = {

            name:
                document.getElementById(
                    "editName"
                ).value,

            email:
                document.getElementById(
                    "editEmail"
                ).value,

            phone:
                document.getElementById(
                    "editPhone"
                ).value,

            jobRole:
                document.getElementById(
                    "editJobRole"
                ).value,

            currentCompany:
                document.getElementById(
                    "editCurrentCompany"
                ).value,

            experienceYears:
                Number(
                    document.getElementById(
                        "editExperienceYears"
                    ).value
                ) || 0,

            qualification:
                document.getElementById(
                    "editQualification"
                ).value,

            yop:
                Number(
                    document.getElementById(
                        "editYop"
                    ).value
                ) || null,

            education:
                document.getElementById(
                    "editEducation"
                ).value,

            linkedin:
                document.getElementById(
                    "editLinkedin"
                ).value,

            portfolio:
                document.getElementById(
                    "editPortfolio"
                ).value,

            skills,

            source:
                document.getElementById(
                    "editSource"
                ).value,

            stage:
                document.getElementById(
                    "editStage"
                ).value,

            rating:
                Number(
                    document.getElementById(
                        "editRating"
                    ).value
                ),

            coverLetter:
                document.getElementById(
                    "editCoverLetter"
                ).value
        };


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedCandidate
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Update failed"
                );

                return;
            }


            alert(
                "Candidate updated successfully"
            );


            editCandidateModal.style.display =
                "none";


            loadCandidates();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to update candidate"
            );

        }

    }
);


// ==========================================
// CHANGE STAGE
// ==========================================

async function changeStage(id) {

    const stage =
        prompt(
            "Enter stage:\n" +
            "Applied\n" +
            "Screening\n" +
            "Interview\n" +
            "Selected\n" +
            "Rejected"
        );


    if (!stage) {
        return;
    }


    const validStages = [
        "Applied",
        "Screening",
        "Interview",
        "Selected",
        "Rejected"
    ];


    if (
        !validStages.includes(stage)
    ) {

        alert(
            "Invalid stage"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}/stage`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            stage
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update stage"
            );

            return;
        }


        alert(
            "Candidate stage updated"
        );


        loadCandidates();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to update stage"
        );

    }
}


// ==========================================
// BULK STAGE UPDATE
// ==========================================

bulkStageBtn.addEventListener(
    "click",
    async () => {

        const stage =
            bulkStageSelect.value;


        if (!stage) {

            alert(
                "Select a stage first"
            );

            return;
        }


        if (
            selectedIds.size === 0
        ) {

            alert(
                "Select at least one candidate"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/bulk/stage`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                ids:
                                    Array.from(
                                        selectedIds
                                    ),
                                stage
                            })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Bulk update failed"
                );

                return;
            }


            alert(
                "Candidates updated successfully"
            );


            selectedIds.clear();

            loadCandidates();


        } catch (error) {

            console.error(error);

            alert(
                "Bulk stage update failed"
            );

        }

    }
);


// ==========================================
// DELETE
// ==========================================

async function deleteCandidate(id) {

    if (
        !confirm(
            "Are you sure you want to delete this candidate?"
        )
    ) {

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


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Delete failed"
            );

            return;
        }


        alert(
            "Candidate deleted successfully"
        );


        loadCandidates();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete candidate"
        );

    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

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


// ==========================================
// INITIAL LOAD
// ==========================================

loadCandidates();