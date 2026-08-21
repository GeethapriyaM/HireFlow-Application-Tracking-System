
document.addEventListener("DOMContentLoaded", async function () {

    // ============================================================
    // GET INTERVIEW ID
    // ============================================================

    const params =
        new URLSearchParams(window.location.search);

    const interviewId =
        params.get("id");


    // ============================================================
    // GET ELEMENTS
    // ============================================================

    const candidateName =
        document.getElementById("candidateName");

    const candidateJobRole =
        document.getElementById("candidateJobRole");

    const interviewType =
        document.getElementById("interviewType");

    const interviewer =
        document.getElementById("interviewer");

    const scoreInput =
        document.getElementById("score");

    const feedbackInput =
        document.getElementById("feedback");

    const decisionSelect =
        document.getElementById("decision");

    const submitButton =
        document.getElementById(
            "submitEvaluationButton"
        );

    const message =
        document.getElementById(
            "evaluationMessage"
        );


    // ============================================================
    // CHECK INTERVIEW ID
    // ============================================================

    if (!interviewId) {

        showMessage(
            "Interview ID is missing.",
            "error"
        );

        return;
    }


    // ============================================================
    // LOAD INTERVIEW DETAILS
    // ============================================================

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/interviews/${interviewId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load interview details."
            );

        }


        const interview =
            await response.json();


        console.log(
            "Interview loaded:",
            interview
        );


        // ========================================================
        // GET CANDIDATE
        // ========================================================

        const candidate =
            interview.candidateId;


        if (
            !candidate ||
            typeof candidate !== "object"
        ) {

            throw new Error(
                "Candidate information not found."
            );

        }


        // ========================================================
        // DISPLAY CANDIDATE INFORMATION
        // ========================================================

        candidateName.textContent =
            candidate.name || "-";


        candidateJobRole.textContent =
            candidate.position || "-";


        interviewType.textContent =
            interview.interviewType || "-";


        interviewer.textContent =
            interview.interviewer || "-";


    } catch (error) {

        console.error(
            "Error loading evaluation:",
            error
        );


        candidateName.textContent = "-";
        candidateJobRole.textContent = "-";
        interviewType.textContent = "-";
        interviewer.textContent = "-";


        showMessage(
            error.message,
            "error"
        );

    }


    // ============================================================
    // SUBMIT EVALUATION
    // ============================================================

    submitButton.addEventListener(
        "click",
        async function () {

            const score =
                scoreInput.value.trim();


            const feedback =
                feedbackInput.value.trim();


            const decision =
                decisionSelect.value;


            // ====================================================
            // VALIDATE SCORE
            // ====================================================

            if (
                score === "" ||
                Number(score) < 0 ||
                Number(score) > 100
            ) {

                showMessage(
                    "Please enter a valid score between 0 and 100.",
                    "error"
                );

                scoreInput.focus();

                return;
            }


            // ====================================================
            // VALIDATE FEEDBACK
            // ====================================================

            if (feedback === "") {

                showMessage(
                    "Please enter candidate feedback.",
                    "error"
                );

                feedbackInput.focus();

                return;
            }


            // ====================================================
            // VALIDATE DECISION
            // ====================================================

            if (decision === "") {

                showMessage(
                    "Please select the final decision.",
                    "error"
                );

                decisionSelect.focus();

                return;
            }


            // ====================================================
            // DISABLE BUTTON
            // ============================================================

            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";


            try {

                const response =
                    await fetch(
                        `http://localhost:3000/api/interviews/${interviewId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                evaluationScore:
                                    Number(score),

                                evaluationFeedback:
                                    feedback,

                                evaluationDecision:
                                    decision,

                                status:
                                    "Completed"

                            })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Evaluation response:",
                    result
                );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to submit evaluation."
                    );

                }


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                if (decision === "selected") {

                    showMessage(
                        "Evaluation submitted successfully. Candidate selected.",
                        "success"
                    );

                } else {

                    showMessage(
                        "Evaluation submitted successfully. Candidate rejected.",
                        "success"
                    );

                }


                // =================================================
                // DISABLE FORM
                // =================================================

                scoreInput.disabled = true;

                feedbackInput.disabled = true;

                decisionSelect.disabled = true;

                submitButton.disabled = true;

                submitButton.textContent =
                    "Evaluation Submitted";


                // =================================================
                // GO BACK TO INTERVIEW PAGE
                // =================================================

                setTimeout(function () {

                    window.location.href =
                        "interview.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Evaluation submission error:",
                    error
                );


                showMessage(
                    error.message,
                    "error"
                );


                // Re-enable button only when submission fails

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Evaluation";

            }

        }
    );


    // ============================================================
    // SHOW MESSAGE
    // ============================================================

    function showMessage(
        text,
        type
    ) {

        if (!message) {
            return;
        }


        message.textContent =
            text;


        message.style.display =
            "block";


        message.className =
            `message ${type}`;

    }

});

