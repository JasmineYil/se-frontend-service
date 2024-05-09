document.getElementById("currency-dropdown").addEventListener("change", function () {
    changeCurrencyRent()
})

function changeCurrencyRent() {
    let pickupDate = document.getElementById('pickupDate').value;
    let returnDate = document.getElementById('returnDate').value;
    let valueButton = document.getElementById('currency-dropdown').value;

    fetch('http://localhost:9095/api/v1/cars?' + new URLSearchParams({
        "toCurrency": valueButton,
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
            displayCarsWithNewPrice(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayCarsWithNewPrice(cars) {
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
            const confirmBooking = window.confirm(`Do you want to book ${car.brandName} ${car.modelName}?`);
            if (confirmBooking) {
                bookCar(car)
            }
        });

        bookButtonCell.appendChild(bookButton);
        container.appendChild(carTable);
    });
}

function getCurrencySymbol(currency) {
    switch (currency) {
        case 'USD':
            return '$';
        case 'EUR':
            return '€';
        case 'GBP':
            return '£';
        default:
            return '$';
    }
}
