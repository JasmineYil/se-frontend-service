document.getElementById('currency-dropdown').addEventListener('change', function () {
    submitRentForm();
});

function submitRentForm() {
    let pickupDate = document.getElementById('pickupDate').value;
    let returnDate = document.getElementById('returnDate').value;
    const today = new Date().toISOString().split('T')[0];

    if (!pickupDate || !returnDate) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Dates',
            text: 'Please select both pickup and return dates.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (new Date(pickupDate) > new Date(returnDate)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Dates',
            text: 'Return date must be after the pickup date.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (new Date(pickupDate) < new Date(today)) {
        Swal.fire({
            icon: 'error',
            title: 'Past Date',
            text: 'Pickup date cannot be a past date.',
            confirmButtonText: 'OK'
        });
        return;
    }

    fetchCars(pickupDate, returnDate);
}

function displayCars(cars) {
    const container = document.getElementById('carsContainer');
    container.innerHTML = '';
    const currencySymbol = getCurrencySymbol(document.getElementById('currency-dropdown').value);
    cars.forEach(car => {
        const carTable = document.createElement('table');
        carTable.id = 'carTable';
        const carRow = carTable.insertRow();
        carRow.id = `carRow-${car.id}`;

        const brandCell = carRow.insertCell();
        const modelCell = carRow.insertCell();
        const seatsCell = carRow.insertCell();
        const priceCell = carRow.insertCell();

        brandCell.innerHTML = `Brand: ${car.brandName}`;
        modelCell.innerHTML = `Model: ${car.modelName}`;
        seatsCell.innerHTML = `Seats: ${car.numberOfSeats}`;
        priceCell.innerHTML = `Price/Day: ${car.price}${currencySymbol}`;

        const bookButtonCell = carRow.insertCell();
        const bookButton = document.createElement('button');
        bookButton.id = 'bookButton';
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => {
            Swal.fire({
                title: 'Confirm Booking',
                text: `Do you want to book ${car.brandName} ${car.modelName}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, book it!',
                cancelButtonText: 'No, cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    bookCar(car);
                }
            });
        });

        bookButtonCell.appendChild(bookButton);
        container.appendChild(carTable);
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

function bookCar(car) {
    let pickupDate = document.getElementById('pickupDate').value;
    let returnDate = document.getElementById('returnDate').value;
    const today = new Date().toISOString().split('T')[0];

    fetch('http://localhost:9095/api/v1/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            carId: car.id,
            pickupDate: pickupDate,
            returnDate: returnDate,
            orderDate: today,
            price: car.price
        })
    })
        .then(response => {
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    text: `You have booked ${car.brandName} ${car.modelName}.`,
                    confirmButtonText: 'OK'
                }).then(() => {
                    fetchCars(pickupDate, returnDate); // Refresh the list after a successful booking
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: `Booking failed for ${car.brandName} ${car.modelName}.`,
                    confirmButtonText: 'OK'
                });
            }
        })

        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'An Error Occurred',
                text: 'An error occurred during the booking process. Please try again later.',
                confirmButtonText: 'OK'
            });
        })
}

function fetchCars(pickupDate, returnDate) {
    fetch('http://localhost:9095/api/v1/cars?' + new URLSearchParams({
        "pickupDate": pickupDate,
        "returnDate": returnDate
    }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        })
        .then(data => {
            displayCars(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}