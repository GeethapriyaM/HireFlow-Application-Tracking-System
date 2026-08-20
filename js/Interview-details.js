document.addEventListener("DOMContentLoaded", async function () {

    const params = new URLSearchParams(window.location.search);
    const interviewId = params.get("id");

    if (!interviewId) {
        alert("Interview ID is missing.");
        return;
    }

    const rescheduleButton =
        document.getElementById("rescheduleButton");

    const cancelButton =
        document.getElementById("cancelButton");

    const rescheduleForm =
        document.getElementById("rescheduleForm");

    const closeRescheduleButton =
        document.getElementById("closeRescheduleButton");

    const saveRescheduleButton =
        document.getElementById("saveRescheduleButton");


    // =====================================================
    // LOAD INTERVIEW
    // =====================================================

    async function loadInterview() {

        try {

            const response = await fetch(
                `http://localhost:3000/api/interviews/${interviewId}`
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Interview not found"
                );
            }

            console.log("Interview:", result);

            displayInterview(result);

        } catch (error) {

            console.error("Interview loading error:", error);

            alert(error.message);

        }

    }


    // =====================================================
    // DISPLAY INTERVIEW
    // =====================================================

    function displayInterview(interview) {

        const candidate = interview.candidateId;

        if (!candidate || typeof candidate !== "object") {

            alert("Candidate information not found.");

            return;

        }


        document.getElementById("candidateName").textContent =
            candidate.name || "-";

        document.getElementById("candidateJobRole").textContent =
            candidate.jobRole || "-";

        document.getElementById("candidateExperience").textContent =
            `${candidate.experienceYears || 0} years`;

        document.getElementById("candidateEmail").textContent =
            candidate.email || "-";

        document.getElementById("candidateSkills").textContent =
            Array.isArray(candidate.skills)
                ? candidate.skills.join(", ")
                : "-";

        document.getElementById("candidateStage").textContent =
            candidate.stage || "-";


        document.getElementById("interviewDate").textContent =
            interview.interviewDate
                ? formatDate(interview.interviewDate)
                : "Not scheduled";

        document.getElementById("interviewTime").textContent =
            interview.interviewTime || "Not scheduled";

        document.getElementById("interviewType").textContent =
            interview.interviewType || "Not scheduled";

        document.getElementById("interviewer").textContent =
            interview.interviewer || "Not assigned";

        document.getElementById("interviewStatus").textContent =
            interview.status || "Not scheduled";


        // =================================================
        // BUTTON STATE
        // =================================================

        if (interview.status === "Cancelled") {

            rescheduleButton.disabled = true;
            cancelButton.disabled = true;

        } else {

            rescheduleButton.disabled = false;
            cancelButton.disabled = false;

        }

    }


    // =====================================================
    // RESCHEDULE BUTTON
    // =====================================================

    rescheduleButton.addEventListener(
        "click",
        function () {

            rescheduleForm.style.display = "block";

        }
    );


    // =====================================================
    // CLOSE RESCHEDULE
    // =====================================================

    closeRescheduleButton.addEventListener(
        "click",
        function () {

            rescheduleForm.style.display = "none";

        }
    );


    // =====================================================
    // SAVE RESCHEDULE
    // =====================================================

    saveRescheduleButton.addEventListener(
        "click",
        async function () {

            const newDate =
                document.getElementById(
                    "newInterviewDate"
                ).value;

            const newTime =
                document.getElementById(
                    "newInterviewTime"
                ).value;


            if (!newDate) {

                alert("Please select a new date.");
                return;

            }

            if (!newTime) {

                alert("Please select a new time.");
                return;

            }


            try {

                const response = await fetch(
                    `http://localhost:3000/api/interviews/${interviewId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            interviewDate: newDate,

                            interviewTime:
                                formatTime(newTime)

                        })

                    }
                );


                const result =
                    await response.json();


                console.log(
                    "Reschedule response:",
                    result
                );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to reschedule interview"
                    );

                }


                rescheduleForm.style.display =
                    "none";


                document.getElementById(
                    "newInterviewDate"
                ).value = "";

                document.getElementById(
                    "newInterviewTime"
                ).value = "";


                displayInterview(
                    result.interview
                );


                alert(
                    "Interview rescheduled successfully!"
                );


            } catch (error) {

                console.error(
                    "Reschedule error:",
                    error
                );

                alert(error.message);

            }

        }
    );


    // =====================================================
    // CANCEL INTERVIEW
    // =====================================================

    cancelButton.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "Are you sure you want to cancel this interview?"
                );


            if (!confirmed) {
                return;
            }


            try {

                console.log(
                    "Cancelling interview:",
                    interviewId
                );


                const response = await fetch(
                    `http://localhost:3000/api/interviews/${interviewId}/cancel`,
                    {
                        method: "PATCH"
                    }
                );


                const result =
                    await response.json();


                console.log(
                    "Cancel response:",
                    result
                );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to cancel interview"
                    );

                }


                displayInterview(
                    result.interview
                );


                alert(
                    "Interview cancelled successfully!"
                );


            } catch (error) {

                console.error(
                    "Cancel error:",
                    error
                );

                alert(error.message);

            }

        }
    );


    // =====================================================
    // DATE FORMAT
    // =====================================================

    function formatDate(date) {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // =====================================================
    // TIME FORMAT
    // =====================================================

    function formatTime(time) {

        const [hours, minutes] =
            time.split(":");

        let hour = parseInt(hours);

        const period =
            hour >= 12 ? "PM" : "AM";

        hour =
            hour % 12 || 12;

        return `${hour}:${minutes} ${period}`;

    }


    // =====================================================
    // START
    // =====================================================

    await loadInterview();

});