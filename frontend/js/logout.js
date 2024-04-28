window.addEventListener('load', (event) => {
    checkLoginState();
});

function checkLoginState() {
    fetch('api/v1/customers/check-session', {
        method: "GET",
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                updateLoginLinkToLogout();
                document.getElementById('manageBookings').style.display = 'block';
                document.getElementById('twonavbar-box').style.display = 'block';
            } else {
                updateLoginLinkToLogin();
                document.getElementById('manageBookings').style.display = 'none';
                document.getElementById('twonavbar-box').style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Error checking session:", error);
        });
}

function updateLoginLinkToLogout() {
    const loginLink = document.querySelector('.home-links[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = "#";
        loginLink.addEventListener('click', handleLogout);
    }
}

function updateLoginLinkToLogin() {
    const loginLink = document.querySelector('.home-links[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = 'Login | Register';
        loginLink.href = "login.html";
        loginLink.removeEventListener('click', handleLogout);
    }
}

function handleLogout(event) {
    event.preventDefault();
    fetch('api/v1/customers/logout', {
        method: "POST",
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                updateLoginLinkToLogin();
                window.location.href = "/index.html";
            } else {
                alert("Logout failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred during logout. Please try again later.");
        });
}