// ===============================
// FLOOD RISK
// ===============================

function checkFlood() {

    let result = document.getElementById("floodResult");

    let risks = ["LOW", "MEDIUM", "HIGH"];

    let random = Math.floor(Math.random() * 3);

    let risk = risks[random];

    if (risk === "LOW") {

        result.innerHTML = "🟢 LOW FLOOD RISK";

        result.style.backgroundColor = "#d1fae5";

    }

    else if (risk === "MEDIUM") {

        result.innerHTML = "🟠 MEDIUM FLOOD RISK";

        result.style.backgroundColor = "#fef3c7";

    }

    else {

        result.innerHTML =
            "🔴 HIGH FLOOD RISK - Avoid low lying roads";

        result.style.backgroundColor = "#fecaca";

    }
}


// ===============================
// MAP
// ===============================

let map = L.map("map").setView(
    [12.9716, 77.5946],
    12
);


// OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors"
    }
).addTo(map);


// Pothole marker
L.marker([12.9716, 77.5946])
    .addTo(map)
    .bindPopup("🕳️ Pothole detected");


// Flooded road marker
L.marker([12.9850, 77.6050])
    .addTo(map)
    .bindPopup("🌊 Flooded Road");


// ===============================
// GET USER LOCATION
// ===============================

function getLocation() {

    let location =
        document.getElementById("location");

    if (!navigator.geolocation) {

        location.innerHTML =
            "Location is not supported.";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude =
                position.coords.latitude;

            let longitude =
                position.coords.longitude;

            location.innerHTML =
                "📍 Latitude: " +
                latitude +
                "<br>" +
                "Longitude: " +
                longitude;


            // Move map to user's location
            map.setView(
                [latitude, longitude],
                15
            );


            // Add user location marker
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("📍 Your Location")
                .openPopup();

        },

        function() {

            location.innerHTML =
                "❌ Unable to get your location.";

        }

    );

}


// ===============================
// REPORT ROAD HAZARD
// ===============================

function reportHazard() {

    let hazard =
        document.getElementById("hazard").value;

    let place =
        document.getElementById("place").value;

    let result =
        document.getElementById("reportResult");


    if (place === "") {

        result.innerHTML =
            "⚠️ Please enter the location.";

        return;

    }


    result.innerHTML =
        "✅ " +
        hazard +
        " reported at " +
        place +
        "!";
}

