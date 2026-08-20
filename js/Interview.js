document.addEventListener("DOMContentLoaded", async function () {

    const upcomingTableBody =
        document.querySelector("#upcomingInterviews tbody");

    const completedTableBody =
        document.querySelector("#completedInterviews tbody");


    try {

        const interviewResponse =
            await fetch(
                "http://localhost:3000/api/interviews"
            );


        if (!interviewResponse.ok) {
            throw new Error("Failed to load interviews");
        }


        const interviews =
            await interviewResponse.json();


        const candidateResponse =
            await fetch(
                "http://localhost:3000/api/candidates"
            );


        if (!candidateResponse.ok) {
            throw new Error("Failed to load candidates");
        }


        const candidates =
            await candidateResponse.json();


        upcomingTableBody.innerHTML = "";
        completedTableBody.innerHTML = "";


        interviews.forEach(function (interview) {

            const candidateId =
                typeof interview.candidateId === "object"
                    ? interview.candidateId._id
                    : interview.candidateId;


            const candidate =
                candidates.find(function (item) {

                    return item._id === candidateId;

                });


            const candidateName =
                candidate
                    ? candidate.name
                    : "Unknown Candidate";


            const jobRole =
                candidate
                    ? candidate.jobRole
                    : "-";


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


            const interviewTime =
                interview.interviewTime || "-";


            const interviewType =
                interview.interviewType || "-";


            const status =
                interview.status || "-";


            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${candidateName}</td>

                <td>${jobRole}</td>

                <td>${interviewDate}</td>

                <td>${interviewTime}</td>

                <td>${interviewType}</td>

                <td>${status}</td>

                <td>
                    <button
                        class="viewInterviewButton"
                        data-interview-id="${interview._id}">
                        View
                    </button>
                </td>
            `;


            if (status === "Completed") {

                completedTableBody.appendChild(row);

            } else {

                upcomingTableBody.appendChild(row);

            }

        });


        // =================================================
        // VIEW BUTTON
        // =================================================

        document
            .querySelectorAll(".viewInterviewButton")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const interviewId =
                            button.dataset.interviewId;


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