// Mock Data for Resources
const mockResources = [
    {
        id: 1,
        itemName: "Mountain Bicycle",
        category: "Cycles",
        description: "21-gear mountain bike in excellent condition. Perfect for campus commute and weekend trails.",
        availability: "Available",
        price: 3000,
        location: "Hostel A, Room 205",
        image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop",
        datePosted: "2026-02-10"
    },
    {
        id: 2,
        itemName: "Electric Kettle",
        category: "Kitchen",
        description: "1.5L capacity electric kettle. Barely used, moving out soon.",
        availability: "Available",
        price: 0,
        location: "Hostel B, Room 112",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
        datePosted: "2026-02-12"
    },
    {
        id: 3,
        itemName: "Data Structures Textbook",
        category: "Books",
        description: "Classic CS textbook in great condition. No marks or highlights.",
        availability: "Available",
        price: 500,
        location: "Central Library Area",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
        datePosted: "2026-02-14"
    },
    {
        id: 4,
        itemName: "LED Study Lamp",
        category: "Electronics",
        description: "Adjustable brightness LED desk lamp. Works perfectly.",
        availability: "Reserved",
        price: 200,
        location: "Hostel C, Room 304",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
        datePosted: "2026-02-13"
    },
    {
        id: 5,
        itemName: "Badminton Racket Set",
        category: "Sports",
        description: "Two rackets with shuttlecocks. Good condition, great for beginners.",
        availability: "Available",
        price: 800,
        location: "Sports Complex",
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop",
        datePosted: "2026-02-11"
    },
    {
        id: 6,
        itemName: "Mini Refrigerator",
        category: "Electronics",
        description: "Compact fridge perfect for dorm room. 2 years old, excellent condition.",
        availability: "Available",
        price: 2500,
        location: "Hostel D, Room 108",
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop",
        datePosted: "2026-02-09"
    },
    {
        id: 7,
        itemName: "Study Table",
        category: "Furniture",
        description: "Wooden study table with drawer. Sturdy and spacious.",
        availability: "Available",
        price: 1500,
        location: "Hostel A, Room 101",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
        datePosted: "2026-02-08"
    },
    {
        id: 8,
        itemName: "Laptop Stand",
        category: "Electronics",
        description: "Ergonomic aluminum laptop stand. Adjustable height.",
        availability: "Available",
        price: 600,
        location: "Hostel B, Room 215",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        datePosted: "2026-02-15"
    }
];

// Mock Data for Rides
const mockRides = [
    {
        id: 1,
        from: "Campus Main Gate",
        to: "City Railway Station",
        date: "2026-02-18",
        time: "14:00",
        seats: 1,
        costPerPerson: 20,
        driver: "Rahul Sharma",
        vehicle: "Motorcycle",
        datePosted: "2026-02-15"
    },
    {
        id: 2,
        from: "Hostel Complex",
        to: "City Mall",
        date: "2026-02-17",
        time: "18:30",
        seats: 1,
        costPerPerson: 15,
        driver: "Priya Patel",
        vehicle: "Scooter",
        datePosted: "2026-02-15"
    },
    {
        id: 3,
        from: "Main Campus",
        to: "Airport",
        date: "2026-02-20",
        time: "06:00",
        seats: 1,
        costPerPerson: 50,
        driver: "Amit Kumar",
        vehicle: "Motorcycle",
        datePosted: "2026-02-14"
    },
    {
        id: 4,
        from: "Library Block",
        to: "Bus Stand",
        date: "2026-02-16",
        time: "16:00",
        seats: 1,
        costPerPerson: 10,
        driver: "Sneha Reddy",
        vehicle: "Bicycle",
        datePosted: "2026-02-15"
    },
    {
        id: 5,
        from: "Engineering Block",
        to: "City Center",
        date: "2026-02-19",
        time: "10:00",
        seats: 1,
        costPerPerson: 25,
        driver: "Vikram Singh",
        vehicle: "Electric Cycle",
        datePosted: "2026-02-13"
    },
    {
        id: 6,
        from: "Hostel A",
        to: "Hospital",
        date: "2026-02-17",
        time: "09:00",
        seats: 1,
        costPerPerson: 30,
        driver: "Anjali Verma",
        vehicle: "Scooter",
        datePosted: "2026-02-16"
    }
];

// API Functions for Resources
const ResourceAPI = {
    // Get all resources
    getAllResources: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockResources]);
            }, 300);
        });
    },

    // Add new resource
    addResource: function(resourceData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newResource = {
                    id: mockResources.length + 1,
                    ...resourceData,
                    datePosted: new Date().toISOString().split('T')[0]
                };
                mockResources.push(newResource);
                resolve(newResource);
            }, 300);
        });
    },

    // Search resources
    searchResources: function(query, category) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...mockResources];
                
                // Filter by category
                if (category && category !== 'all') {
                    filtered = filtered.filter(item => item.category === category);
                }
                
                // Filter by search query
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    filtered = filtered.filter(item => 
                        item.itemName.toLowerCase().includes(lowerQuery) ||
                        item.description.toLowerCase().includes(lowerQuery) ||
                        item.category.toLowerCase().includes(lowerQuery)
                    );
                }
                
                resolve(filtered);
            }, 300);
        });
    }
};

// API Functions for Rides
const RideAPI = {
    // Get all rides
    getAllRides: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockRides]);
            }, 300);
        });
    },

    // Add new ride
    addRide: function(rideData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRide = {
                    id: mockRides.length + 1,
                    ...rideData,
                    datePosted: new Date().toISOString().split('T')[0]
                };
                mockRides.push(newRide);
                resolve(newRide);
            }, 300);
        });
    },

    // Search rides
    searchRides: function(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!query) {
                    resolve([...mockRides]);
                    return;
                }
                
                const lowerQuery = query.toLowerCase();
                const filtered = mockRides.filter(ride => 
                    ride.from.toLowerCase().includes(lowerQuery) ||
                    ride.to.toLowerCase().includes(lowerQuery) ||
                    ride.driver.toLowerCase().includes(lowerQuery)
                );
                
                resolve(filtered);
            }, 300);
        });
    }
};

// When connecting to real backend, replace these functions with actual fetch() calls
// Example:
// getAllResources: function() {
//     return fetch('http://localhost:3000/api/resources')
//         .then(response => response.json());
// }