function submitRentForm() {
    let pickupDate = document.getElementById('pickupDate').value;
    let returnDate = document.getElementById('returnDate').value;
    const today = new Date().toISOString().split('T')[0];

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (!pickupDate || !returnDate) {
        alert('Please select both pickup and return dates.');
        return;
    }

    if (new Date(pickupDate) < currentDate) {
        alert('Pickup date cannot be in the past.');
        return;
    }

    if (new Date(returnDate) < currentDate) {
        alert('Return date cannot be in the past.');
        return;
    }

    if (new Date(pickupDate) > new Date(returnDate)) {
        alert('Return date must be after the pickup date.');
        return;
    }

    if (new Date(pickupDate) < new Date(today)) {
        alert('Pickup date cannot be a past date');
        return;
    }

    fetchCars(pickupDate, returnDate);
}

function displayCars(cars) {
    const container = document.getElementById('carsContainer');
    container.innerHTML = '';
    cars.forEach(car => {
        const carTable = document.createElement('table');
        carTable.id = 'carTable';
        const carRow = carTable.insertRow();
        carRow.id = `carRow-${car.id}`;

        const brandCell = carRow.insertCell();
        const modelCell = carRow.insertCell();
        const seatsCell = carRow.insertCell();
        const priceCell = carRow.insertCell();

        brandCell.innerHTML = `Brand: ${car.brand}`;
        modelCell.innerHTML = `Model: ${car.model}`;
        seatsCell.innerHTML = `Seats: ${car.numberOfSeats}`;
        priceCell.innerHTML = `Price: ${car.price} $`;

        const bookButtonCell = carRow.insertCell();
        const bookButton = document.createElement('button');
        bookButton.id = 'bookButton';
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => {
            const confirmBooking = window.confirm(`Do you want to book ${car.brand} ${car.model}?`);
            if (confirmBooking) {
                bookCar(car)
            }
        });

        bookButtonCell.appendChild(bookButton);
        container.appendChild(carTable);
    });
}

function bookCar(car) {
    let pickupDate = document.getElementById('pickupDate').value;
    let returnDate = document.getElementById('returnDate').value;
    const today = new Date().toISOString().split('T')[0];

    fetch('/api/v1/bookings', {
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
                alert(`You have booked ${car.brand} ${car.model}`);
                fetchCars(pickupDate, returnDate);
            } else {
                alert(`Booking failed for ${car.brand} ${car.model}`);
            }
        })

        .catch(error => {
            console.log(error)
            alert("An error occurred. Please try again later.");
        })
}

function fetchCars(pickupDate, returnDate) {
    fetch('/api/v1/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pickupDate: pickupDate,
            returnDate: returnDate
        })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        })
        .then(data => {
            console.log(data);
            displayCars(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}