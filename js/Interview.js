const API_URL = "http://localhost:3000/api";

let interviews = [];
let candidates = [];
let editingInterviewId = null;


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadCandidates();
    loadInterviews();

    // Schedule Interview button
    document
        .getElementById("openScheduleInterview")
        .addEventListener("click", openScheduleForm);

    // Close schedule modal
    document
        .getElementById("closeInterviewModal")
        .addEventListener("click", closeInterviewForm);

    // Cancel schedule modal
    document
        .getElementById("cancelInterview")
        .addEventListener("click", closeInterviewForm);

    // Close details modal
    document
        .getElementById("closeDetailsModal")
        .addEventListener("click", closeDetailsModal);

    // Form submit
    document
        .getElementById("interviewForm")
        .addEventListener("submit", saveInterview);

    // Search
    document
        .getElementById("searchInput")
        .addEventListener("input", applyFilters);

    // Status filter
    document
        .getElementById("statusFilter")
        .addEventListener("change", applyFilters);

    // Type filter
    document
        .getElementById("typeFilter")
        .addEventListener("change", applyFilters);

    // Sort filter
    document
        .getElementById("sortFilter")
        .addEventListener("change", applyFilters);


    // Close modal when clicking outside
    document
        .getElementById("interviewModal")
        .addEventListener("click", function (event) {

            if (event.target === this) {
                closeInterviewForm();
            }

        });


    // Close details modal when clicking outside
    document
        .getElementById("detailsModal")
        .addEventListener("click", function (event) {

            if (event.target === this) {
                closeDetailsModal();
            }

        });

});


// ============================================================
// LOAD CANDIDATES
// ============================================================

async function loadCandidates() {

    try {

        const response = await fetch(
            `${API_URL}/candidates`
        );

        if (!response.ok) {
            throw new Error("Failed to load candidates");
        }

        const data = await response.json();

        candidates = Array.isArray(data)
            ? data
            : data.candidates || [];

        populateCandidateDropdown();

    } catch (error) {

        console.error(
            "Error loading candidates:",
            error
        );

        candidates = [];

        populateCandidateDropdown();

    }

}


// ============================================================
// POPULATE CANDIDATE DROPDOWN
// ============================================================

function populateCandidateDropdown() {

    const select =
        document.getElementById("candidateId");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Select Candidate
        </option>
    `;


    candidates.forEach(candidate => {

        const option =
            document.createElement("option");

        option.value = candidate._id;


        // Support different candidate name fields
        const candidateName =
            candidate.name ||
            candidate.fullName ||
            `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
            "Unnamed Candidate";


        option.textContent =
            candidateName;


        select.appendChild(option);

    });

}


// ============================================================
// LOAD INTERVIEWS
// ============================================================

async function loadInterviews() {

    showLoading(true);

    try {

        const response = await fetch(
            `${API_URL}/interviews`
        );


        if (!response.ok) {
            throw new Error("Failed to load interviews");
        }


        const data =
            await response.json();


        interviews =
            Array.isArray(data)
                ? data
                : data.interviews || [];


        updateStatistics();

        applyFilters();


    } catch (error) {

        console.error(
            "Error loading interviews:",
            error
        );

        interviews = [];

        updateStatistics();

        renderInterviews([]);

    } finally {

        showLoading(false);

    }

}


// ============================================================
// UPDATE STATISTICS
// ============================================================

function updateStatistics() {

    const total =
        interviews.length;


    const scheduled =
        interviews.filter(
            interview =>
                interview.status === "Scheduled"
        ).length;


    const completed =
        interviews.filter(
            interview =>
                interview.status === "Completed"
        ).length;


    const cancelled =
        interviews.filter(
            interview =>
                interview.status === "Cancelled"
        ).length;


    document.getElementById("totalInterviews")
        .textContent = total;


    document.getElementById("scheduledInterviews")
        .textContent = scheduled;


    document.getElementById("completedInterviews")
        .textContent = completed;


    document.getElementById("cancelledInterviews")
        .textContent = cancelled;

}


// ============================================================
// APPLY FILTERS
// ============================================================

function applyFilters() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const type =
        document
            .getElementById("typeFilter")
            .value;


    const sort =
        document
            .getElementById("sortFilter")
            .value;


    let filtered =
        [...interviews];


    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (search) {

        filtered =
            filtered.filter(interview => {

                const candidate =
                    getCandidate(interview.candidateId);


                const candidateName =
                    getCandidateName(candidate);


                const interviewer =
                    interview.interviewer || "";


                const interviewType =
                    interview.interviewType || "";


                return (

                    candidateName
                        .toLowerCase()
                        .includes(search)

                    ||

                    interviewer
                        .toLowerCase()
                        .includes(search)

                    ||

                    interviewType
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (status !== "All") {

        filtered =
            filtered.filter(
                interview =>
                    interview.status === status
            );

    }


    // --------------------------------------------------------
    // TYPE
    // --------------------------------------------------------

    if (type !== "All") {

        filtered =
            filtered.filter(
                interview =>
                    interview.interviewType === type
            );

    }


    // --------------------------------------------------------
    // SORT
    // --------------------------------------------------------

    if (sort === "newest") {

        filtered.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

    }


    if (sort === "oldest") {

        filtered.sort(
            (a, b) =>
                new Date(a.createdAt || 0) -
                new Date(b.createdAt || 0)
        );

    }


    if (sort === "date") {

        filtered.sort(
            (a, b) =>
                new Date(a.interviewDate || 0) -
                new Date(b.interviewDate || 0)
        );

    }


    renderInterviews(filtered);

}


// ============================================================
// GET CANDIDATE
// ============================================================

function getCandidate(candidateId) {

    if (!candidateId) {
        return null;
    }


    // If backend returns populated candidate object
    if (typeof candidateId === "object") {

        return candidateId;

    }


    // If backend returns only ObjectId
    return candidates.find(
        candidate =>
            String(candidate._id) === String(candidateId)
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

        `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||

        "Unknown Candidate"

    );

}


// ============================================================
// RENDER INTERVIEW TABLE
// ============================================================

function renderInterviews(data) {

    const tableBody =
        document.getElementById(
            "interviewTableBody"
        );


    tableBody.innerHTML = "";


    if (!data || data.length === 0) {

        showEmptyState(true);

        return;

    }


    showEmptyState(false);


    data.forEach(interview => {

        const candidate =
            getCandidate(interview.candidateId);


        const candidateName =
            getCandidateName(candidate);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <!-- Candidate -->

            <td>

                <span class="candidate-name">

                    ${escapeHTML(candidateName)}

                </span>

            </td>


            <!-- Date -->

            <td>

                ${formatDate(interview.interviewDate)}

            </td>


            <!-- Time -->

            <td>

                ${escapeHTML(
                    interview.interviewTime || "-"
                )}

            </td>


            <!-- Interview Type -->

            <td>

                ${escapeHTML(
                    interview.interviewType || "-"
                )}

            </td>


            <!-- Interviewer -->

            <td>

                ${escapeHTML(
                    interview.interviewer || "-"
                )}

            </td>


            <!-- Status -->

            <td>

                <span
                    class="interview-status ${getStatusClass(interview.status)}"
                >

                    ${escapeHTML(
                        interview.status || "-"
                    )}

                </span>

            </td>


            <!-- Actions -->

            <td>

                <div class="action-buttons">


                    <button
                        type="button"
                        class="view-btn"
                        onclick="viewInterview('${interview._id}')"
                    >

                        View

                    </button>


                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editInterview('${interview._id}')"
                    >

                        Edit

                    </button>


                    ${
                        interview.status !== "Cancelled" &&
                        interview.status !== "Completed"

                        ?

                        `

                        <button
                            type="button"
                            class="cancel-interview-btn"
                            onclick="cancelInterview('${interview._id}')"
                        >

                            Cancel

                        </button>

                        `

                        :

                        ""

                    }


                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ============================================================
// OPEN SCHEDULE FORM
// ============================================================

function openScheduleForm() {

    editingInterviewId = null;


    document.getElementById("formTitle")
        .textContent = "Schedule Interview";


    document.getElementById("saveBtnText")
        .textContent = "Schedule Interview";


    document.getElementById("interviewForm")
        .reset();


    document.getElementById("interviewId")
        .value = "";


    document.getElementById("interviewStatus")
        .value = "Scheduled";


    document.getElementById("interviewModal")
        .classList.remove("hidden");

}


// ============================================================
// CLOSE SCHEDULE FORM
// ============================================================

function closeInterviewForm() {

    document.getElementById("interviewModal")
        .classList.add("hidden");

}


// ============================================================
// EDIT INTERVIEW
// ============================================================

function editInterview(id) {

    const interview =
        interviews.find(
            item =>
                String(item._id) === String(id)
        );


    if (!interview) {

        showToast(
            "Interview not found."
        );

        return;

    }


    editingInterviewId =
        interview._id;


    document.getElementById("formTitle")
        .textContent = "Edit Interview";


    document.getElementById("saveBtnText")
        .textContent = "Update Interview";


    document.getElementById("interviewId")
        .value = interview._id;


    // Candidate

    const candidateId =
        typeof interview.candidateId === "object"

            ? interview.candidateId?._id

            : interview.candidateId;


    document.getElementById("candidateId")
        .value = candidateId || "";


    // Date

    document.getElementById("interviewDate")
        .value =
        formatDateForInput(
            interview.interviewDate
        );


    // Time

    document.getElementById("interviewTime")
        .value =
        interview.interviewTime || "";


    // Type

    document.getElementById("interviewType")
        .value =
        interview.interviewType || "Technical";


    // Interviewer

    document.getElementById("interviewer")
        .value =
        interview.interviewer || "";


    // Status

    document.getElementById("interviewStatus")
        .value =
        interview.status || "Scheduled";


    // Evaluation Score

    document.getElementById("evaluationScore")
        .value =
        interview.evaluationScore ?? "";


    // Evaluation Feedback

    document.getElementById("evaluationFeedback")
        .value =
        interview.evaluationFeedback || "";


    // Evaluation Decision

    document.getElementById("evaluationDecision")
        .value =
        interview.evaluationDecision || "";


    // Open modal

    document.getElementById("interviewModal")
        .classList.remove("hidden");

}


// ============================================================
// SAVE / UPDATE INTERVIEW
// ============================================================

async function saveInterview(event) {

    event.preventDefault();


    const candidateId =
        document.getElementById("candidateId")
            .value;


    const interviewDate =
        document.getElementById("interviewDate")
            .value;


    const interviewTime =
        document.getElementById("interviewTime")
            .value;


    const interviewType =
        document.getElementById("interviewType")
            .value;


    const interviewer =
        document.getElementById("interviewer")
            .value
            .trim();


    const status =
        document.getElementById("interviewStatus")
            .value;


    const scoreValue =
        document.getElementById("evaluationScore")
            .value;


    const feedback =
        document.getElementById("evaluationFeedback")
            .value
            .trim();


    const decision =
        document.getElementById("evaluationDecision")
            .value;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!candidateId) {

        alert(
            "Please select a candidate."
        );

        return;

    }


    if (!interviewDate) {

        alert(
            "Please select interview date."
        );

        return;

    }


    if (!interviewTime) {

        alert(
            "Please select interview time."
        );

        return;

    }


    if (!interviewer) {

        alert(
            "Please enter interviewer name."
        );

        return;

    }


    // --------------------------------------------------------
    // DATA
    // --------------------------------------------------------

    const interviewData = {

        candidateId,

        interviewDate,

        interviewTime,

        interviewType,

        interviewer,

        status,

        evaluationScore:
            scoreValue !== ""
                ? Number(scoreValue)
                : undefined,

        evaluationFeedback:
            feedback,

        evaluationDecision:
            decision || undefined

    };


    try {

        let response;


        // ----------------------------------------------------
        // UPDATE
        // ----------------------------------------------------

        if (editingInterviewId) {

            response =
                await fetch(
                    `${API_URL}/interviews/${editingInterviewId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                interviewData
                            )
                    }
                );

        }


        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        else {

            response =
                await fetch(
                    `${API_URL}/interviews`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                interviewData
                            )
                    }
                );

        }


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to save interview."
            );

            return;

        }


        showToast(
            editingInterviewId

                ? "Interview updated successfully!"

                : "Interview scheduled successfully!"
        );


        closeInterviewForm();


        editingInterviewId = null;


        await loadInterviews();

    }


    catch (error) {

        console.error(
            "Save interview error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


// ============================================================
// CANCEL INTERVIEW
// ============================================================

async function cancelInterview(id) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this interview?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/interviews/${id}/cancel`,
                {
                    method: "PATCH"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to cancel interview."
            );

            return;

        }


        showToast(
            "Interview cancelled successfully!"
        );


        await loadInterviews();

    }


    catch (error) {

        console.error(
            "Cancel interview error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


// ============================================================
// VIEW INTERVIEW
// ============================================================

function viewInterview(id) {

    const interview =
        interviews.find(
            item =>
                String(item._id) === String(id)
        );


    if (!interview) {

        showToast(
            "Interview not found."
        );

        return;

    }


    const candidate =
        getCandidate(
            interview.candidateId
        );


    const candidateName =
        getCandidateName(candidate);


    document.getElementById(
        "interviewDetails"
    ).innerHTML = `

        <div class="details-content">


            <div class="detail-row">

                <span class="detail-label">
                    Candidate
                </span>

                <span class="detail-value">
                    ${escapeHTML(candidateName)}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Date
                </span>

                <span class="detail-value">
                    ${formatDate(
                        interview.interviewDate
                    )}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Time
                </span>

                <span class="detail-value">
                    ${escapeHTML(
                        interview.interviewTime || "-"
                    )}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Interview Type
                </span>

                <span class="detail-value">
                    ${escapeHTML(
                        interview.interviewType || "-"
                    )}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Interviewer
                </span>

                <span class="detail-value">
                    ${escapeHTML(
                        interview.interviewer || "-"
                    )}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Status
                </span>

                <span class="detail-value">

                    <span class="interview-status ${getStatusClass(interview.status)}">

                        ${escapeHTML(
                            interview.status || "-"
                        )}

                    </span>

                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Evaluation Score
                </span>

                <span class="detail-value">

                    ${
                        interview.evaluationScore !== undefined &&
                        interview.evaluationScore !== null

                        ?

                        `${interview.evaluationScore}/100`

                        :

                        "-"
                    }

                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Decision
                </span>

                <span class="detail-value">

                    ${
                        interview.evaluationDecision
                            ? formatDecision(
                                interview.evaluationDecision
                            )
                            : "-"
                    }

                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Feedback
                </span>

                <span class="detail-value">

                    ${
                        interview.evaluationFeedback
                            ? escapeHTML(
                                interview.evaluationFeedback
                            )
                            : "-"
                    }

                </span>

            </div>


        </div>

    `;


    document.getElementById("detailsModal")
        .classList.remove("hidden");

}


// ============================================================
// CLOSE DETAILS MODAL
// ============================================================

function closeDetailsModal() {

    document.getElementById("detailsModal")
        .classList.add("hidden");

}


// ============================================================
// LOADING STATE
// ============================================================

function showLoading(show) {

    const loading =
        document.getElementById("loadingState");


    if (show) {

        loading.classList.remove("hidden");

    } else {

        loading.classList.add("hidden");

    }

}


// ============================================================
// EMPTY STATE
// ============================================================

function showEmptyState(show) {

    const empty =
        document.getElementById("emptyState");


    if (show) {

        empty.classList.remove("hidden");

    } else {

        empty.classList.add("hidden");

    }

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(status) {

    return String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

}


// ============================================================
// FORMAT DECISION
// ============================================================

function formatDecision(decision) {

    if (decision === "selected") {
        return "Selected";
    }


    if (decision === "rejected") {
        return "Rejected";
    }


    return decision || "-";

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


    if (isNaN(parsedDate.getTime())) {
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
// FORMAT DATE FOR INPUT
// ============================================================

function formatDateForInput(date) {

    if (!date) {
        return "";
    }


    const parsedDate =
        new Date(date);


    if (isNaN(parsedDate.getTime())) {
        return "";
    }


    const year =
        parsedDate.getFullYear();


    const month =
        String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            parsedDate.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ============================================================
// TOAST
// ============================================================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.style.display =
        "block";


    setTimeout(() => {

        toast.style.display =
            "none";

    }, 2500);

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