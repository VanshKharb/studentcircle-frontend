// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const postRideForm = document.getElementById('postRideForm');
    const searchBar = document.getElementById('searchBar');
    const ridesGrid = document.getElementById('ridesGrid');
    const emptyState = document.getElementById('emptyState');
    const dateInput = document.getElementById('date');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Load all rides on page load
    loadRides();

    // Form submission handler
    postRideForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            from: document.getElementById('from').value.trim(),
            to: document.getElementById('to').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            seats: parseInt(document.getElementById('seats').value),
            costPerPerson: parseInt(document.getElementById('costPerPerson').value),
            driver: document.getElementById('driver').value.trim(),
            vehicle: document.getElementById('vehicle').value
        };

        // Validation
        if (!formData.from || !formData.to || !formData.date || !formData.time || 
            !formData.seats || formData.costPerPerson === undefined || !formData.driver || !formData.vehicle) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        // Validate date
        const selectedDate = new Date(formData.date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < currentDate) {
            showFormMessage('Please select today or a future date', 'error');
            return;
        }

        // Validate seats
        if (formData.seats < 1 || formData.seats > 2) {
            showFormMessage('Seats must be between 1 and 2', 'error');
            return;
        }

        try {
            await RideAPI.addRide(formData);
            showFormMessage('Ride posted successfully! 🎉', 'success');
            postRideForm.reset();
            loadRides();
        } catch (error) {
            console.error('Error posting ride:', error);
            showFormMessage('Failed to post ride. Please try again.', 'error');
        }
    });

    // Search handler
    searchBar.addEventListener('input', function() {
        filterRides();
    });

    // Load rides
    async function loadRides() {
        try {
            const rides = await RideAPI.getAllRides();
            displayRides(rides);
        } catch (error) {
            console.error('Error loading rides:', error);
            showEmptyState();
        }
    }

    // Filter rides
    async function filterRides() {
        const searchQuery = searchBar.value.trim();
        
        try {
            const rides = await RideAPI.searchRides(searchQuery);
            displayRides(rides);
        } catch (error) {
            console.error('Error filtering rides:', error);
            showEmptyState();
        }
    }

    // Display rides
    function displayRides(rides) {
        if (rides.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();
        
        // Sort by date
        const sortedRides = rides.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
        
        ridesGrid.innerHTML = sortedRides.map(ride => createRideCard(ride)).join('');
        
        // Add join button listeners
        document.querySelectorAll('.join-btn').forEach(button => {
            button.addEventListener('click', function() {
                const rideId = this.getAttribute('data-ride-id');
                handleJoinRide(rideId);
            });
        });
    }

    // Get vehicle icon
    function getVehicleIcon(vehicle) {
        const icons = {
            'Bicycle': 'fa-bicycle',
            'Electric Cycle': 'fa-bicycle',
            'Motorcycle': 'fa-motorcycle',
            'Scooter': 'fa-motorcycle'
        };
        return icons[vehicle] || 'fa-bicycle';
    }

    // Format time
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Get initials
    function getInitials(name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Format date
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Create ride card
    function createRideCard(ride) {
        const formattedDate = formatDate(ride.date);
        const formattedTime = formatTime(ride.time);
        const totalCost = ride.costPerPerson * ride.seats;
        const initials = getInitials(ride.driver);
        const vehicleIcon = getVehicleIcon(ride.vehicle);

        return `
            <div class="ride-card fade-in" data-id="${ride.id}">
                <div class="ride-header">
                    <div class="ride-route">
                        <div class="route-display">
                            <span class="location">${ride.from}</span>
                            <span class="route-arrow">→</span>
                            <span class="location">${ride.to}</span>
                        </div>
                        <div class="ride-datetime">
                            <span class="datetime-item">
                                <i class="far fa-calendar"></i> ${formattedDate}
                            </span>
                            <span class="datetime-item">
                                <i class="far fa-clock"></i> ${formattedTime}
                            </span>
                        </div>
                    </div>
                    <div class="ride-cost">
                        <div class="cost-label">Cost</div>
                        <div class="cost-amount">₹${ride.costPerPerson}</div>
                        <div class="cost-per-person">per person</div>
                    </div>
                </div>
                
                <div class="ride-details">
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-chair"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Seats</span>
                            <span class="detail-value">${ride.seats} available</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas ${vehicleIcon}"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Vehicle</span>
                            <span class="detail-value">${ride.vehicle}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-rupee-sign"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Total Split</span>
                            <span class="detail-value">₹${totalCost}</span>
                        </div>
                    </div>
                </div>
                
                <div class="ride-footer">
                    <div class="driver-info">
                        <div class="driver-avatar">${initials}</div>
                        <div class="driver-details">
                            <span class="driver-name">${ride.driver}</span>
                            <span class="vehicle-type">${ride.vehicle}</span>
                        </div>
                    </div>
                    <button class="join-btn" data-ride-id="${ride.id}" ${ride.seats === 0 ? 'disabled' : ''}>
                        ${ride.seats === 0 ? 'Fully Booked' : 'Join Ride'}
                    </button>
                </div>
            </div>
        `;
    }

    // Handle join ride
    function handleJoinRide(rideId) {
        const confirmJoin = confirm('Do you want to join this ride? The driver will be notified.');
        
        if (confirmJoin) {
            alert('Ride joined successfully! The driver will contact you soon.');
            // In real app: RideAPI.joinRide(rideId, userId)
        }
    }

    // Show/hide empty state
    function showEmptyState() {
        ridesGrid.style.display = 'none';
        emptyState.style.display = 'block';
    }

    function hideEmptyState() {
        ridesGrid.style.display = 'flex';
        emptyState.style.display = 'none';
    }

    // Show form message
    function showFormMessage(message, type = 'success') {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
        
        const form = document.getElementById('postRideForm');
        form.parentNode.insertBefore(messageDiv, form);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Form validation
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#fc8181';
            } else {
                this.style.borderColor = '#48bb78';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });

    // Validate seats
    const seatsInput = document.getElementById('seats');
    const costInput = document.getElementById('costPerPerson');

    seatsInput.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 2) this.value = 2;
    });

    costInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
});