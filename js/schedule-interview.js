document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // =====================================================
        // ELEMENTS
        // =====================================================

        const candidateSelect =
            document.getElementById("candidate");

        const form =
            document.getElementById(
                "scheduleInterviewForm"
            );


        // =====================================================
        // CHECK ELEMENTS
        // =====================================================

        if (!candidateSelect || !form) {

            console.error(
                "Schedule interview form elements not found."
            );

            return;

        }


        // =====================================================
        // LOAD CANDIDATES
        // =====================================================

        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/candidates"
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load candidates"
                );

            }


            const candidates = result;


            // Clear existing options except first option

            candidateSelect.innerHTML = `
                <option value="">
                    Select Candidate
                </option>
            `;


            candidates.forEach(
                function (candidate) {

                    const option =
                        document.createElement("option");


                    option.value =
                        candidate._id;


                    // Candidate model uses "position",
                    // not "jobRole"

                    option.textContent =
                        `${candidate.name} - ${candidate.position || "-"}`;


                    candidateSelect.appendChild(
                        option
                    );

                }
            );


        } catch (error) {

            console.error(
                "Candidate loading error:",
                error
            );

            alert(
                error.message ||
                "Unable to load candidates."
            );

        }


        // =====================================================
        // SCHEDULE INTERVIEW
        // =====================================================

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // =================================================
                // GET FORM VALUES
                // =================================================

                const candidateId =
                    candidateSelect.value;

                const interviewDate =
                    document.getElementById(
                        "interviewDate"
                    ).value;

                const interviewTime =
                    document.getElementById(
                        "interviewTime"
                    ).value;

                const interviewType =
                    document.getElementById(
                        "interviewType"
                    ).value;

                const interviewer =
                    document.getElementById(
                        "interviewer"
                    ).value.trim();


                // =================================================
                // VALIDATION
                // =================================================

                if (!candidateId) {

                    alert(
                        "Please select a candidate."
                    );

                    return;

                }


                if (!interviewDate) {

                    alert(
                        "Please select an interview date."
                    );

                    return;

                }


                if (!interviewTime) {

                    alert(
                        "Please select an interview time."
                    );

                    return;

                }


                if (!interviewType) {

                    alert(
                        "Please select an interview type."
                    );

                    return;

                }


                if (!interviewer) {

                    alert(
                        "Please enter the interviewer name."
                    );

                    return;

                }


                // =================================================
                // SEND REQUEST
                // =================================================

                try {

                    const response =
                        await fetch(
                            "http://localhost:3000/api/interviews",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    candidateId,

                                    interviewDate,

                                    interviewTime,

                                    interviewType,

                                    interviewer

                                })

                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "Schedule Interview Response:",
                        result
                    );


                    // =================================================
                    // ERROR
                    // =================================================

                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Failed to schedule interview"
                        );

                    }


                    // =================================================
                    // SUCCESS
                    // =================================================

                    alert(
                        "Interview scheduled successfully!"
                    );


                    // IMPORTANT:
                    // Use INTERVIEW ID here,
                    // NOT candidate ID.

                    if (
                        result.interview &&
                        result.interview._id
                    ) {

                        window.location.href =
                            `interview-details.html?id=${result.interview._id}`;

                    } else {

                        // Fallback

                        window.location.href =
                            "interviews.html";

                    }


                } catch (error) {

                    console.error(
                        "Schedule Interview Error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Failed to schedule interview."
                    );

                }

            }
        );

    }
);