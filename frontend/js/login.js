document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    fetch('http://localhost:9095/api/v1/customers/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = "/index.html";
                });
            } else {
                return response.text().then(text => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Please check your email and password.',
                        confirmButtonText: 'OK'
                    });
                    return Promise.reject(text);
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});