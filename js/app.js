/*
 * Google Map Initialiser
 */
function initialiser() {
    /*
     *  get user's location:
     */
    $(document).ready( function() {
    $.getJSON("http://freegeoip.net/json/", function(result){
        latitude = result.latitude;
        longitude = result.longitude;
        var latlng = new google.maps.LatLng(latitude, longitude);
        var options = {
                center : latlng,
                zoom : 11,
                mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        carte = new google.maps.Map(document.getElementById("carte"), options);
        });
    });
}

/*
 * GeoLocalization, using html5 geolocalization
 */
function geoLocate() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(successCallback);
    else
        alert("Your browser does not support HTML5 Geolocation!");
}

/*
 * This function is called on GeoLocalization success. ref. geoLocate()
 */
function successCallback(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;		
    reverseGeocoding(lat, lng);
    setUserLocation(lat, lng);
}

/*
 * This fucntion sets the user location on the map. ref. successCallback()
 */
function setUserLocation(lat, lng) {
    var range = parseFloat((document.getElementById("amount").value).replace(' Km', ''));
    var artist = document.getElementById('artist').value;
    carte.panTo(new google.maps.LatLng(lat, lng));
    var marker = new google.maps.Marker({
        position : new google.maps.LatLng(lat, lng),
        map : carte
    });
    getConcerts(lat, lng, range, artist);
}

/*
 * Reverse geocoding
 */
function reverseGeocoding(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    geocoder.geocode({"latLng" : point }, function(data, status) {
            if (status == google.maps.GeocoderStatus.OK && data[0]) {
                document.getElementById("address").value = data[0].formatted_address;
            } else {
                alert("Error: " + status);
            }
        });
    return false;
}

/*
 * Geocoding address from form after submit
 */
function geoCodeAddress(obj) {
    var geocoder = new google.maps.Geocoder();
    if (obj != '') {
        geocoder.geocode({ "address" : obj }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latlng = results[0].geometry.location + "";
                var tab_latlng = latlng.split(',');
                var latitude = tab_latlng[0].replace('(', '');
                var longitude = tab_latlng[1].replace(')', '');
                window.history.pushState("something", "Title", "/concert?lat="+latitude+"&long="+longitude+"&range=5");
                setUserLocation(latitude, longitude);
            } else {
                alert("No such address exists!");
            }
        });
    }
}

var infoWindows = [];

function closeInfoWindows(){
    var i = infoWindows.length;
    while(i--)
    {
        infoWindows[i].close();
    }
}

/*
 * Map markers customization
 */
function newPoint(carte, response, oms){
    var loc = new google.maps.LatLng(response.latlong[0], response.latlong[1]);
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: response.title
    });
    oms.addMarker(lemarqueur);
    var WindowOptions = { content:'<table><tr><td><img src="'
    +response.image+'"/></td><td><p style="font-size: 14px; font-weight: bold;">'
    +response.title+'</p class="info-window"> <p style="font-size: 13px;"><b>Artists:</b> '
    +response.artist+'<br><b>Date:</b> '+response.startDate+'<br>'
    + response.address.name +' '+ response.address.street + '<br>'
    + response.address.postalcode +', '+ response.address.city +', '+ response.address.country
    + '<br><a target="_blank" href =' +response.url+'>More Info</a></p></td></tr></table>'};    
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    infoWindows.push(InfoWindow);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        closeInfoWindows();
        InfoWindow.open(carte,lemarqueur);
    });
    return lemarqueur;
}

/*
 * On AJAX call success this function is called. ref. getConcerts()
 */
function plotOverlay(lat, lng, response) {
    var latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    var options = {
            center : latlng,
            zoom : 12,
            mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carte"), options);
    var pinColor = "#79CDCD";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
                                    + pinColor, new google.maps.Size(21, 34),
                    new google.maps.Point(0, 0), new google.maps.Point(10,34));
    var marqueur = new google.maps.Marker({
            position : new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
            map : carte,
            title : "Your Location",
            icon : pinImage
    });
    var myWindowOptions = { content : '<h5>Your Location</h5>'};
    var myInfoWindow = new google.maps.InfoWindow(myWindowOptions);
    google.maps.event.addListener(marqueur, 'click', function() {
            myInfoWindow.open(carte, marqueur);
    });
    var oms = new OverlappingMarkerSpiderfier(carte, {keepSpiderfied:true});
    var markers =[];
    if (response.length != 0) {
        for (var i = 0 ; i < response.length; i++) {
            markers.push(newPoint(carte, response[i], oms));
        };
        var markerCluster = new MarkerClusterer(carte, markers);
        markerCluster.setMaxZoom(15);
        markerCluster.setGridSize(40);
        google.maps.event.addDomListener(window, 'load', initialiser);
    } else alert('No conerts found at this time for the given parameters (range/address/artist)');
     
}

/*
 * AJAX call to server
 */
function getConcerts(lat, lng, range, artist) {
    $.ajax({
        type : 'get',
        url : '/concert?lat=' + parseFloat(lat) + '&long='+ parseFloat(lng) + '&range='+ parseFloat(range) + '&artist=' + artist,
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        error: function(e) {alert(" Too many concerts that I can handle!\n Reduce range please");},
        success : function(response) {
                plotOverlay(lat, lng, response);
        }
    });
}