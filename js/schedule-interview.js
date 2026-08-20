document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const candidateSelect =
            document.getElementById("candidate");

        const form =
            document.getElementById(
                "scheduleInterviewForm"
            );


        // =====================================================
        // LOAD CANDIDATES
        // =====================================================

        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/candidates"
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load candidates"
                );

            }


            const candidates =
                await response.json();


            candidates.forEach(
                function (candidate) {

                    const option =
                        document.createElement("option");


                    option.value =
                        candidate._id;


                    option.textContent =
                        `${candidate.name} - ${candidate.jobRole}`;


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


                if (
                    !candidateId ||
                    !interviewDate ||
                    !interviewTime ||
                    !interviewType ||
                    !interviewer
                ) {

                    alert(
                        "Please fill all fields."
                    );

                    return;

                }


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


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Failed to schedule interview"
                        );

                    }


                    alert(
                        "Interview scheduled successfully!"
                    );


                    // IMPORTANT:
                    // Send INTERVIEW ID, not candidate ID

                    window.location.href =
                        `interview-details.html?id=${result.interview._id}`;


                } catch (error) {

                    console.error(
                        "Schedule Interview Error:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );

    }
);