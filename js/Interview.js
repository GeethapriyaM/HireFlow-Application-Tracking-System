document.addEventListener("DOMContentLoaded", async function () {

    // ============================================================
    // ELEMENTS
    // ============================================================

    const upcomingTableBody =
        document.querySelector("#upcomingInterviews tbody");

    const completedTableBody =
        document.querySelector("#completedInterviews tbody");

    const scheduleButton =
        document.getElementById("scheduleInterviewButton");

        


    // ============================================================
    // SCHEDULE INTERVIEW BUTTON
    // ============================================================

    if (scheduleButton) {

        scheduleButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "schedule-interview.html";

            }
        );

    }


    // ============================================================
    // CHECK INTERVIEW TABLE
    // ============================================================

    if (!upcomingTableBody || !completedTableBody) {
        return;
    }


    // ============================================================
    // LOAD INTERVIEWS
    // ============================================================

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/interviews"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load interviews"
            );

        }


        const interviews =
            await response.json();


        // ========================================================
        // CLEAR TABLES
        // ========================================================

        upcomingTableBody.innerHTML = "";
        completedTableBody.innerHTML = "";


        // ========================================================
        // DISPLAY INTERVIEWS
        // ========================================================

        interviews.forEach(function (interview) {

            // ----------------------------------------------------
            // GET CANDIDATE
            // ----------------------------------------------------

            const candidate =
                interview.candidateId &&
                typeof interview.candidateId === "object"
                    ? interview.candidateId
                    : null;


            const candidateName =
                candidate
                    ? candidate.name
                    : "Unknown Candidate";


            const jobRole =
                candidate
                    ? candidate.jobRole
                    : "-";


            // ----------------------------------------------------
            // DATE
            // ----------------------------------------------------

            const interviewDate =
                interview.interviewDate
                    ? new Date(
                        interview.interviewDate
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "-";


            // ----------------------------------------------------
            // OTHER DETAILS
            // ----------------------------------------------------

            const interviewTime =
                interview.interviewTime || "-";


            const interviewType =
                interview.interviewType || "-";


            const status =
                interview.status || "-";


            // ----------------------------------------------------
            // CREATE ROW
            // ----------------------------------------------------

            const row =
                document.createElement("tr");


            // ====================================================
            // COMPLETED TABLE
            // ====================================================

            if (status === "Completed") {

                row.innerHTML = `

                    <td>
                        ${candidateName}
                    </td>

                    <td>
                        ${jobRole}
                    </td>

                    <td>
                        ${interviewDate}
                    </td>

                    <td>
                        ${interviewType}
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td>

                        <button
                            class="viewInterviewButton"
                            data-interview-id="${interview._id}"
                        >
                            View
                        </button>

                    </td>

                `;


                completedTableBody.appendChild(row);

            }


            // ====================================================
            // UPCOMING TABLE
            // ====================================================

            else {

                row.innerHTML = `

                    <td>
                        ${candidateName}
                    </td>

                    <td>
                        ${jobRole}
                    </td>

                    <td>
                        ${interviewDate}
                    </td>

                    <td>
                        ${interviewTime}
                    </td>

                    <td>
                        ${interviewType}
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td>

                        <button
                            class="viewInterviewButton"
                            data-interview-id="${interview._id}"
                        >
                            View
                        </button>

                    </td>

                `;


                upcomingTableBody.appendChild(row);

            }

        });


        // ========================================================
        // VIEW BUTTONS
        // ========================================================

        document
            .querySelectorAll(".viewInterviewButton")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const interviewId =
                            button.dataset.interviewId;


                        if (!interviewId) {

                            alert(
                                "Interview ID not found."
                            );

                            return;

                        }


                        window.location.href =
                            `interview-details.html?id=${interviewId}`;

                    }
                );

            });


    } catch (error) {

        console.error(
            "Error loading interviews:",
            error
        );


        upcomingTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load interviews.
                </td>
            </tr>
        `;

    }

});