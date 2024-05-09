document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        licenceNumber: document.getElementById('licenceNumber').value
    };
    fetch('http://localhost:9095/api/v1/customers/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/login.html";
            } else {
                alert("Registration failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
});

function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var eyeOpen = document.getElementById('eyeOpen');
    var eyeClosed = document.getElementById('eyeClosed');
    var isPasswordHidden = passwordInput.type === 'password';

    if (isPasswordHidden) {
        passwordInput.type = 'text';  // Set the type to text to show the password
        eyeOpen.style.display = 'inline-block';  // Show the open eye icon
        eyeClosed.style.display = 'none';  // Hide the closed eye icon
    } else {
        passwordInput.type = 'password';  // Set the type to password to hide the password
        eyeOpen.style.display = 'none';  // Hide the open eye icon
        eyeClosed.style.display = 'inline-block';  // Show the closed eye icon
    }
}