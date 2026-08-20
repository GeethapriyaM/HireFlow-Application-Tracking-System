document.addEventListener("DOMContentLoaded", function () {
    // 1. RECRUITMENT PAGE
    const searchInput = document.querySelector(
        'input[placeholder="Search Candidates"]'
    );

    const recruitmentTable = document.querySelector("table");
    if (searchInput && recruitmentTable) {
        const statusSelect = searchInput.nextElementSibling;
        const rows = recruitmentTable.querySelectorAll("tbody tr");
        function filterCandidates() {
            const searchValue = searchInput.value.toLowerCase();
            const statusValue = statusSelect.value.toLowerCase();
            rows.forEach(function (row) {
                const candidateName =
                    row.cells[0].textContent.toLowerCase();
                const candidateStatus =
                    row.cells[3].textContent.toLowerCase();
                const nameMatch =
                    candidateName.includes(searchValue);
                const statusMatch =
                    statusValue === "" ||
                    candidateStatus === statusValue;
                if (nameMatch && statusMatch) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        }
        searchInput.addEventListener("input", filterCandidates);

        statusSelect.addEventListener(
            "change",
            filterCandidates
        );
    }
     // 2. VIEW / SCHEDULE BUTTONS (works on any page)
    document.querySelectorAll("button[data-action]").forEach(function (button) {
        button.addEventListener("click", function () {
            const action = button.dataset.action;

            if (action === "view-detail") {
                window.location.href = button.dataset.page;
            }

            if (action === "schedule-interview") {
                alert("Schedule Interview clicked — API call varum apparam");
            }
        });
    });
  // 3. INTERVIEW DETAIL PAGE
    const buttons = document.querySelectorAll("button");
    buttons.forEach(function (button) {

        if (
            button.textContent.trim() ===
            "Reschedule Interview"
        ) {
            button.addEventListener("click", function () {
                const newDate = prompt(
                    "Enter new interview date:"
                );
                if (newDate) {
                    alert(
                        "Interview rescheduled to " +
                        newDate
                    );
                }
            });
        }
        if (
            button.textContent.trim() ===
            "Cancel Interview"
        ) {
            button.addEventListener("click", function () {
                const confirmCancel = confirm(
                    "Are you sure you want to cancel this interview?"
                );
                if (confirmCancel) {
                    alert(
                        "Interview cancelled successfully."
                    );
                }
            });
        }
    });
 // 4. EVALUATION PAGE
    const scoreInput = document.querySelector(
        'input[placeholder="Enter Score"]'
    );
    const feedbackInput = document.querySelector(
        'textarea[placeholder="Enter Feedback"]'
    );
    if (scoreInput && feedbackInput) {
        const evaluationSelect =
            feedbackInput.parentElement.querySelector("select");
        const submitButton = Array.from(
            document.querySelectorAll("button")
        ).find(function (button) {
            return button.textContent.trim() ===
                "Submit Evaluation";
        });
        if (submitButton) {
            submitButton.addEventListener(
                "click",
                function () {
                    const score =
                        Number(scoreInput.value);
                    const feedback =
                        feedbackInput.value.trim();
                    const decision =
                        evaluationSelect.value;
                    // Check score
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
                    // Check feedback
                    if (feedback === "") {

                        alert(
                            "Please enter candidate feedback."
                        );

                        return;
                    }
                    // Check decision
                    if (decision === "") {
                        alert(
                            "Please select the final decision."
                        );
                        return;
                    }
                    // Final result
                    if (decision === "selected") {

                        alert(
                            "Candidate selected successfully!"
                        );
                    } else if (
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