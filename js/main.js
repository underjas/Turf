let map;
let geojson;
var info = L.control();

// Function to instantiate the Leaflet map
function createMap() {
    map = L.map('map', {
        center: [0, 0], // Center the map on Oregon State University
        zoom: 3
    });

    // Add the base tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        minZoom: 2,
        maxZoom: 16,
        tileSize: 512,
        zoomOffset: -1,
        //accessToken: 'pk.eyJ1IjoidW5kZXJqYXMiLCJhIjoiY202eWpqa3AwMHcyZTJucHM2cDBwcnd0NCJ9.RNRXLOp7rDrsdW0qiOHUFw'
    }).addTo(map);
}

// Fetch GeoJSON and create Voronoi polygons
fetch('turf/data/airports.geojson')
    .then(response => response.json())
    .then(data => {
        // Handle success in fetching data
        var vorP = turf.voronoi(data);

        //popups for polys
        L.geoJSON(vorP, {
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.site) {
                    layer.bindPopup(`Closest Airport: ${feature.properties.site}`);
                } else {
                    // Find the nearest point (airport) to the polygon's centroid
                    let centroid = turf.centroid(feature);
                    let nearest = turf.nearestPoint(centroid, data);
                    let airportName = nearest.properties.name || "Unknown Airport";
                    let airportCode = nearest.properties.abbrev;

                    // Add a popup with the airport's name
                    layer.bindPopup(`<strong>Closest Airport: </strong>${airportName} (${airportCode})`);
                }
            },
        // Style Voronoi polygons
        style: {
            color: '#0077b6',
            weight: 0,
            fillColor: '#ffffff00',
            fillOpacity: 0.5
        }
           
        }).addTo(map);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data: ", error);
    });

// Initialize map
document.addEventListener('DOMContentLoaded', createMap);
