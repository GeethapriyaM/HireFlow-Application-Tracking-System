const API_URL = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;


    // Basic validation

    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // Login failed

        if (!response.ok) {

            alert(
                data.message ||
                "Login failed"
            );

            return;
        }


        // ==========================================
        // SAVE JWT TOKEN
        // ==========================================

        localStorage.setItem(
            "hireflowToken",
            data.token
        );


        // ==========================================
        // SAVE USER INFORMATION
        // ==========================================

        localStorage.setItem(
            "hireflowUser",
            JSON.stringify(data.user)
        );


        console.log(
            "Login successful:",
            data.user
        );


        // ==========================================
        // ROLE-BASED REDIRECTION
        // ==========================================

        if (data.user.role === "candidate") {

            window.location.href =
                "candidate-dashboard.html";

        }

        else if (data.user.role === "recruiter") {

            window.location.href =
                "index.html";

        }

        else {

            alert(
                "Unknown user role."
            );

        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        alert(
            "Unable to connect to HireFlow server."
        );

    }

});