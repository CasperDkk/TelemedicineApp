// Initialize Google Map
function initMap() {
    const mapOptions = {
        center: { lat: -34.397, lng: 150.644 }, // Default center (you can change this)
        zoom: 10,
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

// Function to find nearby health centers
function findNearbyCenters() {
    const locationInput = document.getElementById('location').value;

    // Geocoding the address entered by the user
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': locationInput }, function(results, status) {
        if (status === 'OK') {
            const userLocation = results[0].geometry.location;

            // Center the map on user's location
            map.setCenter(userLocation);

            // Add a marker at the user's location
            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location'
            });

            // Search for nearby health centers (you can customize this)
            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: userLocation,
                radius: 5000, // Search within 5 km radius
                type: ['hospital'] // Change this to other types as needed
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(place => {
                        new google.maps.Marker({
                            position: place.geometry.location,
                            map: map,
                            title: place.name
                        });
                    });
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Call initMap when the page loads
window.initMap = initMap;