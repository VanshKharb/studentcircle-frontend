// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const addItemForm = document.getElementById('addItemForm');
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');
    const itemsGrid = document.getElementById('itemsGrid');
    const emptyState = document.getElementById('emptyState');

    // Load all resources on page load
    loadResources();

    // Form submission handler
    addItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            itemName: document.getElementById('itemName').value.trim(),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value.trim(),
            availability: document.getElementById('availability').value,
            price: parseInt(document.getElementById('price').value) || 0,
            location: document.getElementById('location').value.trim(),
            image: null // Will be handled by backend
        };

        // Basic validation
        if (!formData.itemName || !formData.category || !formData.description || 
            !formData.availability || !formData.location) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Add resource via API
            await ResourceAPI.addResource(formData);
            
            // Show success message
            showFormMessage('Item added successfully! 🎉', 'success');
            
            // Reset form
            addItemForm.reset();
            
            // Reload resources
            loadResources();
            
        } catch (error) {
            console.error('Error adding resource:', error);
            showFormMessage('Failed to add item. Please try again.', 'error');
        }
    });

    // Search handler
    searchBar.addEventListener('input', function() {
        filterResources();
    });

    // Category filter handler
    categoryFilter.addEventListener('change', function() {
        filterResources();
    });

    // Load and display resources
    async function loadResources() {
        try {
            const resources = await ResourceAPI.getAllResources();
            displayResources(resources);
        } catch (error) {
            console.error('Error loading resources:', error);
            showEmptyState();
        }
    }

    // Filter resources based on search and category
    async function filterResources() {
        const searchQuery = searchBar.value.trim();
        const category = categoryFilter.value;
        
        try {
            const resources = await ResourceAPI.searchResources(searchQuery, category);
            displayResources(resources);
        } catch (error) {
            console.error('Error filtering resources:', error);
            showEmptyState();
        }
    }

    // Display resources in grid
    function displayResources(resources) {
        if (resources.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();
        
        itemsGrid.innerHTML = resources.map(item => createItemCard(item)).join('');
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            'Cycles': 'fa-bicycle',
            'Books': 'fa-book',
            'Electronics': 'fa-laptop',
            'Kitchen': 'fa-utensils',
            'Furniture': 'fa-couch',
            'Sports': 'fa-dumbbell',
            'Other': 'fa-box'
        };
        return icons[category] || 'fa-box';
    }

    // Create item card HTML
    function createItemCard(item) {
        const priceDisplay = item.price === 0 ? 'Free' : `₹${item.price}`;
        const priceClass = item.price === 0 ? 'free' : '';
        const statusClass = item.availability.toLowerCase().replace(' ', '-');

        return `
            <div class="item-card fade-in" data-id="${item.id}">
                <div class="item-image">
                    ${item.image 
                        ? `<img src="${item.image}" alt="${item.itemName}" onerror="this.parentElement.innerHTML='<i class=\\'fas ${getCategoryIcon(item.category)}\\'></i>'">` 
                        : `<i class="fas ${getCategoryIcon(item.category)}"></i>`
                    }
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-name">${item.itemName}</h3>
                        <span class="item-price ${priceClass}">${priceDisplay}</span>
                    </div>
                    <span class="item-category">${item.category}</span>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <span class="item-location">
                            <i class="fas fa-map-marker-alt"></i> ${item.location}
                        </span>
                        <span class="item-status ${statusClass}">${item.availability}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Show empty state
    function showEmptyState() {
        itemsGrid.style.display = 'none';
        emptyState.style.display = 'block';
    }

    // Hide empty state
    function hideEmptyState() {
        itemsGrid.style.display = 'grid';
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
        
        const form = document.getElementById('addItemForm');
        form.parentNode.insertBefore(messageDiv, form);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Form validation - real-time feedback
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
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
});