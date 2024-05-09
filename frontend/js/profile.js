document.addEventListener('DOMContentLoaded', function() {
    fetchProfile();
    document.getElementById('deleteProfileBtn').addEventListener('click', function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ad0b0b',
            cancelButtonColor: '#939393',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProfile();
            }
        });
    });
    document.getElementById('settingsBtn').addEventListener('click', function() {
        Swal.fire({
            title: 'Update Mobile Number',
            input: 'text',
            inputLabel: 'Please enter your new mobile number:',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a mobile number!'
                }
                if (value.length > 15) {
                    return 'Please enter a valid phone number!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                updateProfile({ phoneNumber: result.value });
            }
        });
    });
});

function fetchProfile() {
    fetch('http://localhost:9095/api/v1/customers/profile', {
        method: 'GET',
        credentials: 'include' // Ensures cookies are sent with the request
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('firstName').textContent = data.firstName || 'N/A';
            document.getElementById('lastName').textContent = data.lastName || 'N/A';
            document.getElementById('phoneNumber').textContent = data.phoneNumber || 'N/A';
            document.getElementById('email').textContent = data.email || 'N/A';
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching profile. Please try again later.',
            });
        });
}

function deleteProfile() {
    fetch('http://localhost:9095/api/v1/customers/delete', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.ok) {
                clearCookies();
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Deleted',
                    text: 'Your profile has been deleted successfully.',
                }).then(() => {
                    window.location.href = "/index.html";
                });
            } else {
                throw new Error('Failed to delete profile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            handleFetchError(error, 'Failed to delete profile. Please delete existing bookings and try again.');
        });
}

function updateProfile(updatedData) {
    fetch('http://localhost:9095/api/v1/customers/update', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Mobile number updated successfully.',
                })
                fetchProfile(); // Re-fetch profile to update the displayed number
            } else {
                throw new Error('Failed to update profile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            handleFetchError(error, 'Failed to update profile. Please try again.');
        });
}

function clearCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("="); // Find the position of the "=" symbol
        var name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie.trim(); // Use slice to get the cookie name
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure";
        // Added `secure` flag if using HTTPS. Remove if testing locally over HTTP.
    }
}

function handleFetchError(error, errorMessage) {
    console.error('Error:', error);
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
    });
}