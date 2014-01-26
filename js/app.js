/*
 *  Get URL parameters
 */
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

/*
 * Google Map Initialiser
 */
function initialiser() {
    var g_latitude = parseFloat(QueryString.lat),
    g_longitude = parseFloat(QueryString.long),
    g_range = parseFloat(QueryString.range),
    g_artist = QueryString.artist;
    /*
     *  get user's location:
     */
    $(document).ready( function() {
    $.getJSON("http://freegeoip.net/json/", function(result){
        ip_latitude = result.latitude;
        ip_longitude = result.longitude;
        var latlng = new google.maps.LatLng(ip_latitude, ip_longitude);
        var options = {
                center : latlng,
                zoom : 11,
                mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        carte = new google.maps.Map(document.getElementById("carte"), options);
        if (g_latitude && g_longitude && g_range) {
            reverseGeocoding(g_latitude, g_longitude);
            setUserLocation(g_latitude, g_longitude, g_range, g_artist);
        }
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
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    var range = parseFloat((document.getElementById("amount").value).replace(' Km', '')),
    artist = document.getElementById('artist').value;
    update_url(latitude, longitude, range, artist);
    reverseGeocoding(latitude, longitude);
    setUserLocation(latitude, longitude, range, artist);
}

/*
 * This fucntion sets the user location on the map. ref. successCallback()
 */
function setUserLocation(latitude, longitude, range, artist) {
    carte.panTo(new google.maps.LatLng(latitude, longitude));
    var marker = new google.maps.Marker({
        position : new google.maps.LatLng(latitude, longitude),
        map : carte
    });
    getConcerts(latitude, longitude, range, artist);
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
function geoCodeAddress() {
    var address = document.getElementById('address').value,
    range = parseFloat((document.getElementById("amount").value).replace(' Km', '')),
    artist = document.getElementById('artist').value;
    var geocoder = new google.maps.Geocoder();
    if(address != '') {
        geocoder.geocode({ "address" : address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latlng = results[0].geometry.location + "",
                tab_latlng = latlng.split(','),
                latitude = tab_latlng[0].replace('(', ''),
                longitude = tab_latlng[1].replace(')', '');
                latitude = parseFloat(latitude);
                longitude = parseFloat(longitude);
                range = parseFloat(range);
                update_url(latitude, longitude, range, artist);
                setUserLocation(latitude, longitude, range, artist);
            } else alert("No such address exists!");
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
    var fb_share = '<div class="fb-share-button" data-href="http://developers.facebook.com/docs/plugins/" data-width="80" data-type="button"></div>';
    var twitter = '<a href="https://twitter.com/share" class="twitter-share-button" data-lang="en">Tweet</a>';
    var loc = new google.maps.LatLng(response.latlong[0], response.latlong[1]);
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: response.title
    });
    oms.addMarker(lemarqueur);
    var WindowOptions = { content:'<table><tr><td><img src="'
    +response.image+'"/></td><td><p style="font-size: 14px; font-weight: bold;">'
    +response.title+'</span class="info-window"> <p style="font-size: 13px;"><b>Artists:</b> '
    +response.artist+'<br><b>Date:</b> '+response.startDate+'<br>'
    + response.address.name +' '+ response.address.street + '<br>'
    + response.address.postalcode +', '+ response.address.city +', '+ response.address.country
    + '</span><br><a target="_blank" href =' +response.url+
    '><img src="./images/lastfm.png" alt="More Info on Last.fm"/></a>'+ twitter + fb_share + '</td></tr></table>' };
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    infoWindows.push(InfoWindow);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        closeInfoWindows();
        InfoWindow.open(carte,lemarqueur);
    });

    google.maps.event.addListener(InfoWindow, 'domready', function(){
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//connect.facebook.net/en_US/all.js#xfbml=1&appId=566488513446170";fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'facebook-jssdk');
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
    var _responseJSON;
    $.ajax({
        type : 'GET',
        url : '/concert?lat='+lat+'&long='+lng+'&range='+range+'&artist=' + artist,
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {alert(" Too many concerts that I can handle!\n Reduce range please " + JSON.stringify(err) + " " + JSON.stringify(status));},
        success : function(data, status) {
            _responseJSON = JSON.parse(data);
            plotOverlay(lat, lng, _responseJSON);
        }
    });
}


/*
 *  Update URL
 */
function update_url (latitude, longitude, range, artist) {
    window.history.pushState("", "", "?lat="+parseFloat(latitude)+"&long="+parseFloat(longitude)+"&range="+range+"&artist="+artist);
}