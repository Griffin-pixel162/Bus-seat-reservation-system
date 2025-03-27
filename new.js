// Bus Seat Reservation System
class BusSeatReservation {
    constructor(totalSeats) {
        // Initialize seat status (true = available, false = occupied)
        this.seats = {};
        this.selectedSeats = [];

        // Populate seats
        for (let i = 1; i <= totalSeats; i++) {
            // Randomly mark some seats as occupied for demonstration
            this.seats[i] = Math.random() > 0.3;
        }
    }

    // Method to get available seats
    getAvailableSeats() {
        return Object.keys(this.seats)
            .filter(seat => this.seats[seat] === true)
            .map(Number);
    }

    // Method to get occupied seats
    getOccupiedSeats() {
        return Object.keys(this.seats)
            .filter(seat => this.seats[seat] === false)
            .map(Number);
    }

    // Method to select a seat
    selectSeat(seatNumber) {
        // Check if seat is available
        if (!this.seats[seatNumber]) {
            throw new Error('Seat is already occupied');
        }

        // Check if seat is already selected
        if (this.selectedSeats.includes(seatNumber)) {
            // Deselect if already selected
            this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatNumber);
        } else {
            // Select the seat
            this.selectedSeats.push(seatNumber);
        }

        return this.selectedSeats;
    }

    // Method to reserve seats
    reserveSeats() {
        // Mark selected seats as occupied
        this.selectedSeats.forEach(seatNumber => {
            this.seats[seatNumber] = false;
        });

        // Create reservation record
        const reservation = {
            reservedSeats: [...this.selectedSeats],
            timestamp: new Date()
        };

        // Clear selected seats
        this.selectedSeats = [];

        return reservation;
    }

    // Method to display seat layout
    displaySeatLayout() {
        let layout = 'Seat Layout:\n';
        for (let seat in this.seats) {
            layout += `Seat ${seat}: ${this.seats[seat] ? 'Available' : 'Occupied'}\n`;
        }
        return layout;
    }

    // Render seat layout for HTML
    renderSeatLayout() {
        const seatContainer = document.getElementById('seat-container');
        seatContainer.innerHTML = ''; // Clear previous layout

        for (let seat in this.seats) {
            const seatElement = document.createElement('div');
            seatElement.textContent = seat;
            
            // Apply CSS classes based on seat status
            seatElement.className = this.seats[seat] ? 'seat available' : 'seat occupied';
            
            // Add selection functionality
            if (this.seats[seat]) {
                seatElement.addEventListener('click', () => {
                    try {
                        this.selectSeat(Number(seat));
                        this.updateSelectedSeatsDisplay();
                        this.renderSeatLayout();
                    } catch (error) {
                        alert(error.message);
                    }
                });
            }

            seatContainer.appendChild(seatElement);
        }
    }

    // Update selected seats display
    updateSelectedSeatsDisplay() {
        const selectedSeatsDisplay = document.getElementById('selected-seats');
        if (this.selectedSeats.length > 0) {
            selectedSeatsDisplay.textContent = this.selectedSeats.join(', ');
        } else {
            selectedSeatsDisplay.textContent = 'None';
        }
    }
}

// Initialize the BusSeatReservation system
document.addEventListener('DOMContentLoaded', () => {
    const totalSeats = 40; // Example: 40 seats
    const busSeatReservation = new BusSeatReservation(totalSeats);

    // Render the initial seat layout
    busSeatReservation.renderSeatLayout();

    // Handle the reserve button click
    document.getElementById('reserve-btn').addEventListener('click', () => {
        try {
            const reservation = busSeatReservation.reserveSeats();
            alert(`Seats reserved: ${reservation.reservedSeats.join(', ')}\nTimestamp: ${reservation.timestamp}`);
            busSeatReservation.renderSeatLayout();
            busSeatReservation.updateSelectedSeatsDisplay();
        } catch (error) {
            alert(error.message);
        }
    });
});

