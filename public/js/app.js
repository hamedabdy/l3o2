    /*
     * Side bar
     */
    var menuRight = document.getElementById( 'cbp-spmenu-s2' )
        , showRight = document.getElementById( 'showRight' )
        , infoBtn = document.getElementById( 'infoBtn' );

    // Check browser support
    if (typeof(Storage) != "undefined") {
        // Retrieve
        var storageState = localStorage.getItem("infoActive")
        if(!storageState) {
            options();
        }
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }

    showRight.onclick = function() {
        options();
        // Check browser support
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("infoActive", false);
        } else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    };

    function options () {
        classie.toggle( showRight, 'active' );
        classie.toggle( infoBtn, 'showInfo' );
        classie.toggle( menuRight, 'cbp-spmenu-open' );
    }

    /*
     * Toggle artist search button
     */
    var myForm = document.getElementById( 'myForm' )
        , extendBtn = document.getElementById( 'extendBtn' )
        , artist = document.getElementById( 'artist' )
        , range = document.getElementById( 'range' );

    extendBtn.onclick = function() {
      classie.toggle( this, 'active' );
      classie.toggle( artist, 'showInput' );
      classie.toggle( range, 'form-wraper-range-extended' );
      classie.toggle( myForm, 'extendShadow' );
      classie.toggle( extendBtn, 'changeBtn' );
    };

$( '#myForm' ).submit(function(){
    var address = document.getElementById('address').value
        , range = parseFloat($('#range').slider('value'))
        , artist = document.getElementById('artist').value
        , geocoder = new google.maps.Geocoder();
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
                assignUrl(latitude, longitude, range, artist);
            } else alert("Sorry couldn't find the given address!");
        });
    }
});

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

function indexGeoLocate() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(position){
            var latitude = position.coords.latitude
                , longitude = position.coords.longitude
                , range = parseFloat($('#range').slider('value'))
                , artist = document.getElementById('artist').value;
            assignUrl(latitude, longitude, range, artist);
        });
    else
        alert("Your browser does not support HTML5 Geolocation!");
}

/*
 * GeoLocalization, using html5 geolocalization
 */
function geoLocate() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(geoLocateCallback);
    else
        alert("Your browser does not support HTML5 Geolocation!");
}

/*
 * This function is called on GeoLocalization success. ref. geoLocate()
 */
function geoLocateCallback(position) {
    var latitude = position.coords.latitude
        , longitude = position.coords.longitude
        , range = parseFloat($('#range').slider('value'))
        , artist = document.getElementById('artist').value
        , query = {};
        query.lat = position.coords.latitude;
        query.lng = position.coords.longitude;
        query.range = parseFloat($('#range').slider('value'));
        query.artist = document.getElementById('artist').value;
    reverseGeocoding(latitude, longitude, range, artist);
    getConcerts(latitude, longitude, range, artist, function(err, results){
        if(!err) setUserLocation(query, results);
    });
}

function newGoogleMap(ip_latitude, ip_longitude, fn) {
    var latlng = new google.maps.LatLng(ip_latitude, ip_longitude);
    var options = {
            center : latlng,
            zoom : 11,
            mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carte"), options);
    return fn(carte);
}

/*
 * This fucntion sets the user location on the map. ref. geoLocateCallback()
 */
function setUserLocation(query, concerts) {
    // Setting default values to range and artist
    query.range = defaultFor(query.range, 10);
    query.artist = defaultFor(query.artist, '');
    newGoogleMap(query.lat, query.lng, function(carte) {
        carte.panTo(new google.maps.LatLng(query.lat, query.lng));
        var pinColor = "#79CDCD";
        var pinImage = new google.maps.MarkerImage(
            "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
            + pinColor, new google.maps.Size(21, 34),
            new google.maps.Point(0, 0), new google.maps.Point(10,34));
        var marqueur = new google.maps.Marker({
            position : new google.maps.LatLng(query.lat, query.lng),
            map : carte,
            title : "Your Location",
            icon : pinImage
        });
        var myWindowOptions = { content : '<h5>Your Location</h5>'};
        var myInfoWindow = new google.maps.InfoWindow(myWindowOptions);
        google.maps.event.addListener(marqueur, 'click', function() {
            myInfoWindow.open(carte, marqueur);
        });
        reverseGeocoding(query.lat, query.lng, query.range, query.artist);
        plotOverlays(carte, query.lat, query.lng, concerts);
    });
}

/*
 * Reverse geocoding ref. geolocation sucesscallack
 */
function reverseGeocoding(lat, lng, range, artist) {
    var geocoder = new google.maps.Geocoder();
    var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    geocoder.geocode({"latLng" : point }, function(data, status) {
            if (status == google.maps.GeocoderStatus.OK && data[0]) {
                updateFormFields(data[0].formatted_address, range, decodeURIComponent(artist));
            } else {
                alert("Error: " + status);
            }
        });
    return false;
}

/*
 * Geocoding address from form after submit
 */
function geoCodeAddress(address, range, artist) {
    var address = document.getElementById('address').value
        , range = parseFloat($('#range').slider('value'))
        , artist = document.getElementById('artist').value
        , geocoder = new google.maps.Geocoder();
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
                updateUrl(latitude, longitude, range, artist);
                getConcerts(latitude, longitude, range, artist, function(err, results){
                    if(!err) setUserLocation(query, results);
                });
            } else alert("Sorry couldn't find the given address!");
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
function newOverlay(carte, concerts, oms){
    var share = {};
    shareButtons(concerts, function(shareBtns){ share = shareBtns });
    var loc = new google.maps.LatLng(concerts.latlong[0], concerts.latlong[1]);
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: concerts.title
    });
    oms.addMarker(lemarqueur);
    var artist = String(concerts.artist).replace(/,/g, ", ");
    var cover = (concerts.image).replace("/64/", "/126/");
    var WindowOptions = { content:'<table><tr><td><img src="'
    +cover+'"/></td><td><div class="info-window-title">'
    +concerts.title+'</div><div class="info-window-body"><b>Artists: </b>'
    +artist+'<br><b>Date: </b>'+new Date(concerts.startDate).toLocaleString()+'<br>'
    +concerts.address.name+' '+concerts.address.street + '<br>'
    +concerts.address.postalcode+', '+concerts.address.city+', '+concerts.address.country
    +'</div></td></tr><tr><td></td><td>'+share.fb_share+'\t'+share.tw_share+'\t'+share.gplus
    +'\t'+share.su+'\t'+share.lastfm+'</td></tr></table>' };
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    infoWindows.push(InfoWindow);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        closeInfoWindows();
        InfoWindow.open(carte,lemarqueur);
    });
    return lemarqueur;
}

/*
 * Plots concerts on map 
 * - multiple concerts at the same address are Spiderfied
 * - mutiple conerts close to each other are Clustered.
 */
function plotOverlays(carte, lat, lng, concerts) {
    var oms = new OverlappingMarkerSpiderfier(carte, {keepSpiderfied:true});
    var markers =[];
    if (concerts.length != 0) {
        for (var i = 0 ; i < concerts.length; i++) {
            markers.push(newOverlay(carte, concerts[i], oms));
        };
        var markerCluster = new MarkerClusterer(carte, markers);
        markerCluster.setMaxZoom(15);
        markerCluster.setGridSize(40);
    } else alert('No conerts found at this time for the given parameters (range/address/artist)');
     
}

/*
 * AJAX call to server to get concerts
 */
function getConcerts(lat, lng, range, artist, fn) {
    var date = new Date();
    var _responseJSON;
    $.ajax({
        type : 'GET',
        url : '/concert?lat='+lat+'&long='+lng+'&range='+range+'&artist='+artist+'&date='+date,
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {
            console.log(JSON.stringify(err) + " " + JSON.stringify(status) 
                + " " + JSON.stringify(jqxhr));
            return fn(err, null);
        },
        success : function(data, status) {
            if(data && typeof data === "string" && data !== null){
                _responseJSON = JSON.parse(data);
                return fn(null, _responseJSON);
            } else {
                return fn(null, data);
            }
        }
    });
}

/*
 *  Update URL
 */
function update_url (address, range, artist) {
    window.history.pushState("", "", "?address="+address+"&range="
        +range+"&artist="+artist);
}

function updateUrl (lat, lng, range, artist) {
    window.history.pushState("", "", "?lat="+lat+"&lng="+lng+"&range="
        +range+"&artist="+artist);
}

function assignUrl (lat, lng, range, artist) {
    location.assign('/m?lat='+lat+'&lng='+lng+'&range='+range+'&artist='+artist);
}

/*
 *  Update Form fields
 */
function updateFormFields (address, range, artist) {
    document.getElementById("address").value = decodeURIComponent(address);
    document.getElementById("artist").value = artist;
    $('#range').slider('value', range);
}

/*
 *  if a given parameter is not empty or exists. ref. initialiser()
 */
function exists (arg) {
    if(arg && typeof arg === "string" && arg !== null){
        return true;
    } else return false;    
}

function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }