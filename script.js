let map;
let userMarker;
let accuracyCircle;
let currentPosition = null;
let selectedReportPosition = null;
let hazardMarkers = [];
let watchId = null;

// Create the interactive map
map = L.map("map").setView([12.9716, 77.5946], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Select a report location by clicking anywhere on the map
map.on("click", function (event) {
    selectedReportPosition = event.latlng;

    document.getElementById("mapStatus").textContent =
        "Report location selected: " +
        event.latlng.lat.toFixed(5) + ", " +
        event.latlng.lng.toFixed(5);
});

// Watch the user's location
function getLocation() {
    const output = document.getElementById("location");
    const status = document.getElementById("mapStatus");

    if (!navigator.geolocation) {
        output.textContent = "Location is not supported by this browser.";
        return;
    }

    status.textContent = "Requesting location permission...";

    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = navigator.geolocation.watchPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            currentPosition = L.latLng(lat, lng);

            output.innerHTML =
                "📍 You are here<br>" +
                "Latitude: " + lat.toFixed(6) + "<br>" +
                "Longitude: " + lng.toFixed(6);

            if (!userMarker) {
                userMarker = L.marker(currentPosition)
                    .addTo(map)
                    .bindPopup("📍 You are here");

                accuracyCircle = L.circle(currentPosition, {
                    radius: position.coords.accuracy,
                    color: "#0284c7"
                }).addTo(map);

                map.setView(currentPosition, 16);
            } else {
                userMarker.setLatLng(currentPosition);
                accuracyCircle.setLatLng(currentPosition);
                accuracyCircle.setRadius(position.coords.accuracy);
            }

            status.textContent =
                "Live location updated. Click the map to choose a hazard location.";
        },
        function (error) {
            const messages = {
                1: "Location permission denied. Allow location in browser settings.",
                2: "Location unavailable. Check device location settings.",
                3: "Location timed out. Please try again."
            };

            status.textContent =
                messages[error.code] || "Unable to obtain location.";
        },
        {
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 20000
        }
    );
}

// Submit a hazard report and display it on the map
function reportHazard() {
    const hazard = document.getElementById("hazard").value;
    const place = document.getElementById("place").value.trim();
    const photoInput = document.getElementById("photo");
    const result = document.getElementById("reportResult");

    if (!place) {
        result.textContent = "⚠️ Please enter the road or area name.";
        return;
    }

    if (!photoInput.files || !photoInput.files[0]) {
        result.textContent = "⚠️ Please select a photo of the hazard.";
        return;
    }

    const file = photoInput.files[0];

    if (!file.type.startsWith("image/")) {
        result.textContent = "⚠️ Please select an image file.";
        return;
    }

    // Use the location selected on the map, or current GPS location
    const reportPosition = selectedReportPosition || currentPosition;

    if (!reportPosition) {
        result.textContent =
            "⚠️ Click the map to select the hazard location, " +
            "or detect your current location first.";
        return;
    }

    const photoURL = URL.createObjectURL(file);

    const colors = {
        "Pothole": "red",
        "Flooded Road": "blue",
        "Road Damage": "orange"
    };

    const marker = L.circleMarker(reportPosition, {
        radius: 9,
        color: colors[hazard] || "red",
        fillColor: colors[hazard] || "red",
        fillOpacity: 0.85
    }).addTo(map);

    // Use DOM elements for the popup rather than inserting user text as HTML
    const popup = document.createElement("div");
    const title = document.createElement("strong");
    const address = document.createElement("p");
    const image = document.createElement("img");

    title.textContent = "🚨 " + hazard;
    address.textContent = "Location: " + place;
    image.src = photoURL;
    image.alt = "Reported road hazard";
    image.className = "hazard-photo";

    popup.append(title, address, image);
    marker.bindPopup(popup);

    hazardMarkers.push(marker);
    marker.openPopup();

    result.textContent =
        "✅ " + hazard + " added to the map at " + place +
        ". This report is currently stored only in this browser session.";

    // Clear the selected report location after submission
    selectedReportPosition = null;
}

// Demo only: this risk is randomly generated, not based on live weather
function checkFlood() {
    const result = document.getElementById("floodResult");
    const risks = ["LOW", "MEDIUM", "HIGH"];
    const risk = risks[Math.floor(Math.random() * risks.length)];

    const styles = {
        LOW: ["🟢 LOW FLOOD RISK", "#d1fae5"],
        MEDIUM: ["🟠 MEDIUM FLOOD RISK", "#fef3c7"],
        HIGH: ["🔴 HIGH FLOOD RISK — Avoid low-lying roads", "#fecaca"]
    };

    result.textContent = styles[risk][0];
    result.style.backgroundColor = styles[risk][1];
}