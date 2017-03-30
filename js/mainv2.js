$(document).ready(function () {
    
    var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false
    });

    var mymap = L.map('map').locate({
            setView: true,
            maxZoom: 12
        });
    mymap.on('locationfound', createMarkers);

    for(var p = 1; p < 8; p++){
        $.ajax({
            url: "https://crossorigin.me/https://api.brewerydb.com/v2/locations?locationType=micro&countryIsoCode=us&status=verified&key=9b3c5153151c3a3820359b5f90127496&p="+p,
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
                    if (!isNaN(breweryLat) || (!isNaN(breweryLong))) {
                        locations(breweryName, breweryLat, breweryLong, breweryDescr);
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
    /* We are creating a JS object called States
     * Inside it is filled with each state and its corresponding coords
     */
    var states = {
        "Alabama": [33.070322, -86.793072],
        "NH": [123, 123]
    };
    
    // Now, when the user changes the state, we need to update the map with the new coordinates
    $("#states").on("change", function () {
        var newState = $(this).val(); // Pretend this is MA
        updateMap( states[newState] );  // This will look like state["MA"];

        // copiar todo o ajax aqui //
    });

    
    
    
    
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlamV1bmVtZWlzdGVyIiwiYSI6ImNpdjVkYXdtczAxZmwyeW51aHI2c2MzdWQifQ.3G3LbBDukopvlcXyozRUzQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'Find My Brew',
        accessToken: 'pk.eyJ1IjoiY2xlamV1bmVtZWlzdGVyIiwiYSI6ImNpdjVkYXdtczAxZmwyeW51aHI2c2MzdWQifQ.3G3LbBDukopvlcXyozRUzQ'
    }).addTo(mymap);

    function createMarkers(e) {
        // create a marker at the users "latlng" and add it to the map
        L.marker(e.latlng).addTo(mymap).bindPopup('<h3>You are here!</h3>');
    }
    /*customized icon for pointing locations*/
    var hopsIcon = L.icon({
        iconUrl: 'images/hops.png',
        shadowUrl: 'images/hops-shadow.png',
        iconSize: [30, 44], // size of the icon
        shadowSize: [50, 38], // size of the shadow
        iconAnchor: [15, 44], // point of the icon which will correspond to marker's location
        shadowAnchor: [8.5, 38], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    /*add marker to map with the label already with .bindPopup*/
    function locations(name, lat, long, descr) {
        var outputHtml =
            "<h3>" + name + "</h3>" +
            "<p>" + descr + "</p>";


    markers.addLayer(L.marker(
    [lat, long], {
                icon: hopsIcon
            }).addTo(mymap).bindPopup(outputHtml, {
            className: "brewer-description-popup",
            maxWidth: "600"
        }));

    mymap.addLayer(markers);

    }


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

    $('#nearMe').on('click', function () {
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');
        $('#logo').removeClass('down');
        $('#exploreSub').slideUp(500);
        $('.filters').slideUp(250);
        $('.instructionText').not('.nearMeInstruction').fadeOut(250);
        $('.nearMeInstruction').delay(245).fadeIn(250);
        $('#aboutSection').hide();
        $('#map').show();
    });

});