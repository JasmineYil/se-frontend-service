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

function updateBookingTable(bookings) {
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

    bookings.forEach(booking => {
        const row = table.insertRow(-1);
        const brandCell = row.insertCell(0);
        const modelCell = row.insertCell(1);
        const seatsCell = row.insertCell(2);
        const priceCell = row.insertCell(3);
        const pickupDateCell = row.insertCell(4);
        const returnDateCell = row.insertCell(5);
        const orderDateCell = row.insertCell(6);
        const orderIdCell = row.insertCell(7)

        brandCell.textContent = booking.brand;
        modelCell.textContent = booking.model;
        seatsCell.textContent = booking.seats;
        priceCell.textContent = `${booking.price.toFixed(2)}${currencySymbol}`;
        orderDateCell.textContent = formatDate(booking.orderDate);
        pickupDateCell.textContent = formatDate(booking.pickupDate);
        returnDateCell.textContent = formatDate(booking.returnDate);
        orderIdCell.textContent = booking.orderId;

        const deleteButtonCell = row.insertCell(8);
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteButton';
        deleteButton.textContent = '✖';
        deleteButton.onclick = function() {
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete the Booking for ${booking.brand} ${booking.model}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteBooking(booking.orderId, booking.brand, booking.model);
                }
            });
        };
        deleteButtonCell.appendChild(deleteButton);
    });
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
    fetch(`http://localhost:9090/api/v1/bookings/${orderId}`, {
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
