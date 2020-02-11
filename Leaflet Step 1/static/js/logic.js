// LEAFLET  HOMEWORK 

// Store  API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    // Define a function to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function do_OnEachFeature(feature, obj) {
      obj.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  
      console.log(feature);
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: do_OnEachFeature,
      pointToLayer: function(feature, latlng) {
        let radius = feature.properties.mag * 3.5;

        if (feature.properties.mag > 5) {
            fillcolor = '#f06b6b';
        }
        else if (feature.properties.mag >= 4) {
            fillcolor = '#f0936b';
        }
        else if (feature.properties.mag >= 3) {
            fillcolor = '#f3ba4e';
        }
        else if (feature.properties.mag >= 2) {
            fillcolor = '#f3db4c';
        }
        else if (feature.properties.mag >= 1) {
            fillcolor = '#e1f34c';
        }
        else  fillcolor = '#b7f34d';

        return L.circleMarker(latlng, {
            radius: radius,
            color: 'black',
            fillColor: fillcolor,
            fillOpacity: 1,
            weight: 1
        });
      }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
    // Define streetmap and darkmap layer

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Assign colors for legend and markers
    function getColor(color) {
      return color > 5 ? '#f06b6b' :
          color > 4 ? '#f0936b' :
          color > 3 ? '#f3ba4e' :
          color > 2 ? '#f3db4c' :
          color > 1 ? '#e1f34c' : '#b7f34d';
    }

    // Create map legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = map => {
        var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

        // for (let i = 0; i < magnitudes.length; i++) {
        //     div.innerHTML +=
        //     '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        // }
        div.innerHTML+='<b>Magnitude</b><br><hr>'
          grades.forEach( i => {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        })
        return div;
    };
    legend.addTo(myMap);
  };