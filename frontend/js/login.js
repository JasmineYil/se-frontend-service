document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    fetch('api/v1/customers/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/index.html";
                return response.json() // TODO: Das war ursprünglich drinnen. Bin mir unsicher ob das notwendig ist.
            } else {
                alert("Login failed. Please check your email and password.");
                return response.text().then(text => Promise.reject(text));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
});