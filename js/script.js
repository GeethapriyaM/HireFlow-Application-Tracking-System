document.addEventListener("DOMContentLoaded", function () {

    // ============================================================
    // 1. RECRUITMENT PAGE - LOAD CANDIDATES
    // ============================================================

    const searchInput = document.querySelector(
        'input[placeholder="Search Candidates"]'
    );

    const statusSelect = document.querySelector(
        "#statusFilter"
    );

    const candidateTableBody = document.querySelector(
        "#candidateTableBody"
    );

    let candidates = [];


    // ============================================================
    // LOAD CANDIDATES
    // ============================================================

    async function loadCandidates() {

        if (!candidateTableBody) {
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3000/api/candidates"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch candidates"
                );

            }

            candidates =
                await response.json();

            displayCandidates(candidates);

        } catch (error) {

            console.error(
                "Error loading candidates:",
                error
            );

            candidateTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load candidates.
                    </td>
                </tr>
            `;

        }

    }


    // ============================================================
    // DISPLAY CANDIDATES
    // ============================================================

    function displayCandidates(candidateList) {

        if (!candidateTableBody) {
            return;
        }


        if (candidateList.length === 0) {

            candidateTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No candidates found.
                    </td>
                </tr>
            `;

            return;

        }


        candidateTableBody.innerHTML = "";


        candidateList.forEach(function (candidate) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${candidate.name || "-"}
                </td>

                <td>
                    ${candidate.jobRole || "-"}
                </td>

                <td>
                    ${candidate.experienceYears || 0} years
                </td>

                <td>
                    ${candidate.stage || "-"}
                </td>

                <td>
                    <button
                        data-action="view-detail"
                        data-candidate-id="${candidate._id}">
                        View
                    </button>
                </td>
            `;


            candidateTableBody.appendChild(row);

        });

    }


    // ============================================================
    // SEARCH + STATUS FILTER
    // ============================================================

    function filterCandidates() {

        if (!searchInput || !statusSelect) {
            return;
        }


        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const statusValue =
            statusSelect.value
                .toLowerCase()
                .trim();


        const filteredCandidates =
            candidates.filter(function (candidate) {

                const candidateName =
                    (candidate.name || "")
                        .toLowerCase();


                const candidateStatus =
                    (candidate.stage || "")
                        .toLowerCase();


                const nameMatch =
                    candidateName.includes(
                        searchValue
                    );


                const statusMatch =
                    statusValue === "" ||
                    candidateStatus === statusValue;


                return nameMatch && statusMatch;

            });


        displayCandidates(
            filteredCandidates
        );

    }


    // ============================================================
    // FILTER EVENTS
    // ============================================================

    if (searchInput && statusSelect) {

        searchInput.addEventListener(
            "input",
            filterCandidates
        );


        statusSelect.addEventListener(
            "change",
            filterCandidates
        );

    }


    // Load candidates

    loadCandidates();



    // ============================================================
    // 2. VIEW / SCHEDULE BUTTONS
    // ============================================================

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            // ====================================================
            // VIEW DETAIL
            // ====================================================

            if (action === "view-detail") {

                // ------------------------------------------------
                // Interview page
                // ------------------------------------------------

                if (button.dataset.page) {

                    window.location.href =
                        button.dataset.page;

                    return;

                }


                // ------------------------------------------------
                // Recruitment page
                // ------------------------------------------------

                const candidateId =
                    button.dataset.candidateId;


                if (!candidateId) {

                    alert(
                        "Candidate ID not found."
                    );

                    return;

                }


                // Recruitment View goes to
                // candidate details page

                window.location.href =
                    `candidate-details.html?id=${candidateId}`;

            }


            // ====================================================
            // SCHEDULE INTERVIEW
            // ====================================================

            if (
                action ===
                "schedule-interview"
            ) {

                window.location.href =
                    "schedule-interview.html";

            }

        }
    );



    // ============================================================
    // 3. EVALUATION PAGE
    // ============================================================

    const scoreInput =
        document.querySelector(
            'input[placeholder="Enter Score"]'
        );


    const feedbackInput =
        document.querySelector(
            'textarea[placeholder="Enter Feedback"]'
        );


    if (scoreInput && feedbackInput) {

        const evaluationSelect =
            feedbackInput.parentElement
                ? feedbackInput.parentElement
                    .querySelector("select")
                : null;


        const submitButton =
            Array.from(
                document.querySelectorAll("button")
            ).find(function (button) {

                return (
                    button.textContent.trim() ===
                    "Submit Evaluation"
                );

            });


        if (submitButton) {

            submitButton.addEventListener(
                "click",
                function () {

                    const score =
                        Number(
                            scoreInput.value
                        );


                    const feedback =
                        feedbackInput.value.trim();


                    const decision =
                        evaluationSelect
                            ? evaluationSelect.value
                            : "";


                    // ------------------------------------------------
                    // Validate Score
                    // ------------------------------------------------

                    if (
                        scoreInput.value === "" ||
                        score < 0 ||
                        score > 100
                    ) {

                        alert(
                            "Please enter a valid score between 0 and 100."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // Validate Feedback
                    // ------------------------------------------------

                    if (feedback === "") {

                        alert(
                            "Please enter candidate feedback."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // Validate Decision
                    // ------------------------------------------------

                    if (decision === "") {

                        alert(
                            "Please select the final decision."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // Final Result
                    // ------------------------------------------------

                    if (
                        decision === "selected"
                    ) {

                        alert(
                            "Candidate selected successfully!"
                        );

                    }

                    else if (
                        decision === "rejected"
                    ) {

                        alert(
                            "Candidate rejected."
                        );

                    }

                }
            );

        }

    }

});