async function checkSession() {
    try {
        const response = await fetch('http://localhost:9095/api/auth/check-session', { credentials: 'include' });
        if (!response.ok) {
            window.location.href = '/login.html';
        }
    } catch (error) {
        window.location.href = '/login.html';
    }
}
checkSession();