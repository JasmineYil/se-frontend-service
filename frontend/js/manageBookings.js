document.addEventListener('DOMContentLoaded', function() {
    fetchBookings();
});

function fetchBookings() {
    fetch('http://localhost:9095/api/v1/bookings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateBookingTable(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function updateBookingTable(bookings) {
    const table = document.getElementById('CurBookingTable');
    table.innerHTML = '<tr>' +
        '<th>Brand</th>' +
        '<th>Model</th>' +
        '<th>Seat Number</th>' +
        '<th>Price/Day</th>' +
        '<th>Order Date</th>' +
        '<th>Pickup Date</th>' +
        '<th>Return Date</th>' +
        '<th>Order ID</th>' +
        '<th></th>' +
        '</tr>';

    const currencySymbol = getCurrencySymbol(document.getElementById('currency-dropdown').value);


    for (const booking of bookings) {
        const carDetails = await fetchCarDetails(booking.carId)
        const row = table.insertRow(-1);
        const brandCell = row.insertCell(0);
        const modelCell = row.insertCell(1);
        const seatsCell = row.insertCell(2);
        const priceCell = row.insertCell(3);
        const orderDateCell = row.insertCell(4);
        const pickupDateCell = row.insertCell(5);
        const returnDateCell = row.insertCell(6);
        const orderIdCell = row.insertCell(7)

        brandCell.textContent = carDetails.brandName;
        modelCell.textContent = carDetails.modelName;
        seatsCell.textContent = carDetails.numberOfSeats;
        priceCell.textContent = `${booking.price.toFixed(2)}${currencySymbol}`;
        orderDateCell.textContent = formatDate(booking.bookingDate);
        pickupDateCell.textContent = formatDate(booking.pickupDate);
        returnDateCell.textContent = formatDate(booking.returnDate);
        orderIdCell.textContent = booking.bookingId;

        const deleteButtonCell = row.insertCell(8);
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteButton';
        deleteButton.textContent = '✖';
        deleteButton.onclick = function() {
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete the Booking for ${carDetails.brandName} ${carDetails.modelName}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteBooking(booking.bookingId, carDetails.brandName, carDetails.modelName);
                }
            });
        };
        deleteButtonCell.appendChild(deleteButton);
    }
}

async function fetchCarDetails(carId) {
    try {
        const response = await fetch(`http://localhost:9095/api/v1/cars/${carId}`);
        if (!response.ok) {
            alert(`Failed to fetch car details for Car ID: ${carId}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching car details:", error);
        return null;
    }
}

function getCurrencySymbol(currency) {
    switch (currency) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        default: return '$';
    }
}

function deleteBooking(orderId, brand, model) {
    fetch(`http://localhost:9095/api/v1/bookings/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `Booking deleted successfully for ${brand} ${model}.`,
                    confirmButtonText: 'OK'
                });
                fetchBookings(); // Refresh the list after deletion
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: `Deleting failed for ${brand} ${model}.`,
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Delete Error',
                text: `There was a problem with the delete operation: ${error}`,
                confirmButtonText: 'OK'
            });
        });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT');
}
