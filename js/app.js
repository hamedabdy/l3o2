/*
 * Google Map Initialiser
 */
function initialiser() {
        var latlng = new google.maps.LatLng(48.856614, 2.3522219);
        //objet contenant des propriétés avec des identificateurs prédéfinis dans Google Maps permettant
        //de définir des options d'affichage de notre carte
        var options = {
                center : latlng,
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        //constructeur de la carte qui prend en paramêtre le conteneur HTML
        //dans lequel la carte doit s'afficher et les options
        carte = new google.maps.Map(document.getElementById("carte"), options);
}

/*
 * GeoLocalization, using html5 geolocalization
 */
function geoLocate() {
    if (navigator.geolocation)
        var watchId = navigator.geolocation.watchPosition(successCallback, null, { enableHighAccuracy : true});
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
    var rayon = parseFloat((document.getElementById("amount").value).replace(' Km', ''));
    carte.panTo(new google.maps.LatLng(lat, lng));
    var marker = new google.maps.Marker({
        position : new google.maps.LatLng(lat, lng),
        map : carte
    });
    getConcerts(lat, lng, rayon);
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
                setUserLocation(latitude, longitude);
            } else {
                alert("No such address exists!");
            }
        });
    }
}

//var openWindow = false;

/*
 * Map markers customization
 */
function newPoint(carte, response){
    var lemarqueur = new google.maps.Marker({
        position: new google.maps.LatLng(response.latlong[0], response.latlong[1]),
        title: response.title
    });
    var WindowOptions = { content:'<table><tr><td><img src="'
    +response.image+'"/></td><td><p style="font-size: 13px">'
    +response.title+'</p> <p style="font-size: 10px"><b>Artistes:</b> '
    +response.artist+'<br><b>Date:</b> '+response.startDate+'<br>'
    + response.address.name +' '+ response.address.street + '<br>'
    + response.address.postalcode +', '+ response.address.city +', '+ response.address.country
    + '<br><a target="_blank" href =' +response.url+'>Plus d\'infos</a></p></td></tr></table>'};
    
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        //if(openWindow) InfoWindow.close()
       // else {
            InfoWindow.open(carte,lemarqueur);
       //     openWindow = true;
       // }
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
            title : "Target",
            icon : pinImage
    });
    var myWindowOptions = { content : '<h5>Your Location</h5>'};
    var myInfoWindow = new google.maps.InfoWindow(myWindowOptions);
    google.maps.event.addListener(marqueur, 'click', function() {
            myInfoWindow.open(carte, marqueur);
    });
    var markers =[];
    if (response.length != 0) {
        for (var i = 0 ; i < response.length; i++) {
            markers.push(newPoint(carte, response[i]));
        }; 
        var markerCluster = new MarkerClusterer(carte, markers);
        markerCluster.setMaxZoom(15);
        markerCluster.setGridSize(40);
        google.maps.event.addDomListener(window, 'load', initialiser);
    } else alert('No conerts found for the given parameters (range/address)');
     
}

/*
 * AJAX call to server
 */
function getConcerts(lat, lng, rayon) {
    $.ajax({
        type : 'POST',
        url : '/concert?lat=' + parseFloat(lat) + '&long='+ parseFloat(lng) + '&rayon='+ parseFloat(rayon),
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        error: function(e) {alert(" Too many concerts that I can handle!\n Reduce range please");},
        success : function(response) {
                plotOverlay(lat, lng, response);
        }
    });
}
