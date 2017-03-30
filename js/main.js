$(document).ready(function () {
    
    var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false,
        maxClusterRadius: 90,
        animateAddingMarkers: false
    });

    var mymap = L.map('map').setView([37.024142, -95.663794], 4);

    /*
    /* mymap initial view is of the entire US
     *
     *On the first loop below we are loading all the pages - number of pages was retrieved through the use of RocketMan
     *
     *On the second loop we are scooping all the content inside each page.
     *If brewery descr. is empty or undefined it should run the Sorry message - else get the descr. from the brewery. After that run the rest of the function.
     *isNaN is a value taken from the LeafLet.JS - it relates to the lat and long - everytime the lat and long are not a number the brewery should be skipped as the location is invalid.
     *Else run the locations functions and pass all the var.
     */


    for(var p = 1; p < 5; p++){
        $.ajax({
            url: "https://crossorigin.me/https://api.brewerydb.com/v2/locations?locationType=nano&countryIsoCode=us&status=verified&key=9483ca9c2f729c93458b5a82411bdc9c&isClosed=n&inPlanning=n&openToPublic=y&p="+p,
            success: function (response) {
                for (var i = 0; i < response.data.length; i++) {

                    var breweryDescr;
                    if (response.data[i].brewery.description == "" || response.data[i].brewery.description == undefined) {
                        breweryDescr = "Sorry, this brewery has no description available.";
                    } else {
                        breweryDescr = (response.data[i].brewery.description);
                    }
                    var breweryName = (response.data[i].brewery.nameShortDisplay);
                    var breweryLat = (response.data[i].latitude);
                    var breweryLong = (response.data[i].longitude);
                    var breweryLoc = (response.data[i].streetAddress);
                    var breweryCity = (response.data[i].locality);
                    var breweryState = (response.data[i].region);
                    if (!isNaN(breweryLat) || (!isNaN(breweryLong))) {
                        locations(breweryName, breweryLat, breweryLong, breweryDescr, breweryLoc, breweryCity, breweryState);

                    }
                    
                }
            },
            error: function () {
                console.log("Didn't work");
            }
        });
    }


    
    
    /*To display the map - change style of map on L.tileLayer 'https' - use Mapbox*/
    /*.locate is getting the geolocation - for set location remove and use .setView: lat, lon*/

    function updateMap(coordinates) {
        var newLocation = (coordinates.length) ? coordinates : true;

        /*  The line above is called a Ternary Operator.  It basically summarizes an if/else statement into one line */
        /*
         *    if( lat.length && long.length ){
         *      newLocation = [lat, long];
         *   }else {
         *       newLocation = true;
         *   }
         */
        mymap.flyTo(newLocation,7);
    }
    /* Creating a JS object called States
     * Inside it is filled with each state and its corresponding coords
     */
    var states = {
        "Alabama": [33.070322, -86.793072],
        "Alaska": [65.086035, -151.003450],
        "Arizona": [34.087601, -111.519011],
        "Arkansas": [34.898306, -92.306676],
        "California": [36.879729, -119.857055],
        "Colorado": [38.939672, -105.409107],
        "Connecticut": [41.686554, -72.643330],
        "Delaware": [38.931693, -75.442045],
        "Florida": [27.998262, -81.637967],
        "Georgia": [32.746051, -83.242358],
        "Idaho": [44.674479, -114.979121],
        "Illinois": [40.063822, -88.934285],
        "Indiana": [39.690925, -86.110674],
        "Iowa": [41.582494, -93.466593],
        "Kansas": [38.385881, -98.363677],
        "Kentucky": [37.286484, -84.771712],
        "Lousiana": [30.523603, -91.680603],
        "Maine": [45.128090, -69.052532],
        "Maryland": [38.818957, -76.992191],
        "Massachussets": [42.352978, -71.742904],
        "Michigan": [43.468710, -84.669801],
        "Minnesota": [45.965579, -94.410071],
        "Mississipi": [33.065800, -89.577213],
        "Missouri": [38.162222, -92.276618],
        "Montana": [46.487960, -109.062076],
        "Nebraska": [41.339475, -99.397646],
        "Nevada": [39.560408, -116.923087],
        "New Hamshire": [43.603863, -72.103978],
        "New Jersey": [39.725541, -74.699657],
        "New Mexico": [34.362042, -105.884877],
        "New York": [40.676418, -73.972056],
        "North Carolina": [35.544289, -78.364963],
        "North Dakota": [47.096745, -100.682092],
        "Ohio": [40.034246, -82.594786],
        "Oklahoma": [35.460009, -97.277449],
        "Pennsylvania": [40.674467, -77.438134],
        "Rhode Island": [41.674462, -71.488505],
        "South Carolina": [33.953619, -81.000684],
        "South Dakota": [44.171978, -100.540438],
        "Tennessee": [35.889392, -86.341056],
        "Texas": [31.006066, -98.900625],
        "Utah": [39.362329, -111.710342],
        "Vermont": [43.999759, -72.640629],
        "Virginia": [37.518271, -78.721796],
        "Washington": [47.098116, -120.175867],
        "West Virginia": [38.574745, -80.496080],
        "Wisconsin": [44.416435, -89.592401],
        "Wyoming": [42.799721, -107.628605]
    };
    
    // Now, when the user changes the state, we need to update the map with the new coordinates
    $("#states").on("change", function () {
        var newState = $(this).val(); // Pretend this is MA
        updateMap( states[newState] );  // This will look like state["MA"];
    });

    
    
    
    
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlamV1bmVtZWlzdGVyIiwiYSI6ImNpdjVkYXdtczAxZmwyeW51aHI2c2MzdWQifQ.3G3LbBDukopvlcXyozRUzQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'Find My Brew',
        accessToken: 'pk.eyJ1IjoiY2xlamV1bmVtZWlzdGVyIiwiYSI6ImNpdjVkYXdtczAxZmwyeW51aHI2c2MzdWQifQ.3G3LbBDukopvlcXyozRUzQ'
    }).addTo(mymap);

    /*customized icon for pointing locations*/
    var hopsIcon = L.icon({
        iconUrl: 'images/hops.png',
        shadowUrl: 'images/hops-shadow.png',
        iconSize: [15, 22], // size of the icon
        shadowSize: [26, 19], // size of the shadow
        iconAnchor: [8, 22], // point of the icon which will correspond to marker's location
        shadowAnchor: [4.5, 19], // the same for the shadow
        popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
    });

    /*add marker to map with the label already with .bindPopup*/
    function locations(name, lat, long, descr, loc, city, state) {
        var outputHtml =
            "<h3>" + name + "</h3>" +
            "<p>" + descr + "</p>" +
            "<p>" + loc + "<br>" + city + ", " + state + "</p>";


    markers.addLayer(L.marker(
    [lat, long], {
                icon: hopsIcon
            }).addTo(mymap).bindPopup(outputHtml, {
            className: "brewer-description-popup",
            maxWidth: "600"
        }));

    }

 mymap.addLayer(markers);

    //top menu links click listeners//

    $('#explore').on('click', function () {
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');
        $('#logo').toggleClass('down');
        $('#exploreSub').slideToggle(500);
        $('.filters').slideUp(250);
        $('.instructionText').not('#exploreInstruction').fadeOut(250);
        $('#exploreInstruction').delay(245).fadeIn(250);
        $('#states').delay(255).toggle(500);
        $('#aboutSection').hide();
        $('#map').show();
    });

    $('#about').on('click', function () {
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');
        $('#logo').removeClass('down');
        $('#exploreSub').slideUp(500);
        $('.filters').slideUp(250);
        $('.instructionText').not('#aboutInstruction').fadeOut(250);
        $('#aboutInstruction').delay(245).fadeIn(250);
        $('#aboutSection').delay(500).fadeIn(500);
        $('#map').hide();
    });


});