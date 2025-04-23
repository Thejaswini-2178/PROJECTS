// Variables
let watchId = null;
let map;
let marker;
let path = [];
let polyline;
let locationHistory = [];

// DOM elements
const startBtn = document.getElementById('startTracking');
const stopBtn = document.getElementById('stopTracking');
const showHistoryBtn = document.getElementById('showHistory');
const coordinatesEl = document.getElementById('coordinates');
const accuracyEl = document.getElementById('accuracy');
const timestampEl = document.getElementById('timestamp');
const historyEl = document.getElementById('history');

// Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });
}

// Start tracking location
function startTracking() {
    if (navigator.geolocation) {
        startBtn.disabled = true;
        stopBtn.disabled = false;

        // Watch for position changes
        watchId = navigator.geolocation.watchPosition(
            updateLocation,
            handleError,
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Update location on the map
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Update display
    coordinatesEl.textContent = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
    accuracyEl.textContent = `Accuracy: ${accuracy} meters`;
    timestampEl.textContent = `Time: ${new Date(position.timestamp).toLocaleTimeString()}`;

    // Center map on new location
    const newPos = new google.maps.LatLng(lat, lng);
    map.setCenter(newPos);
    map.setZoom(17);

    // Add or update marker
    if (!marker) {
        marker = new google.maps.Marker({
            position: newPos,
            map: map,
            title: "Your location"
        });
    } else {
        marker.setPosition(newPos);
    }

    // Add to path
    path.push(newPos);

    // Update polyline
    if (polyline) {
        polyline.setMap(null);
    }

    polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });

    // Save to history
    locationHistory.push({
        lat: lat,
        lng: lng,
        accuracy: accuracy,
        timestamp: position.timestamp
    });
}

// Handle errors
function handleError(error) {
    let errorMessage;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    alert(errorMessage);
    stopTracking();
}

// Stop tracking
function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

// Show history
function showHistory() {
    historyEl.innerHTML = "<h3>Location History:</h3>";

    if (locationHistory.length === 0) {
        historyEl.innerHTML += "<p>No location history available.</p>";
        return;
    }

    const list = document.createElement('ul');

    locationHistory.forEach((location, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>Point ${index + 1}:</strong><br>
            Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}<br>
            Accuracy: ${location.accuracy} meters<br>
            Time: ${new Date(location.timestamp).toLocaleString()}
        `;
        list.appendChild(item);
    });

    historyEl.appendChild(list);
}

// Event listeners
startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
showHistoryBtn.addEventListener('click', showHistory);