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

function newGoogleMap(ip_latitude, ip_longitude) {
    var latlng = new google.maps.LatLng(ip_latitude, ip_longitude);
    var options = {
            center : latlng,
            zoom : 11,
            mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carte"), options);
}

/*
 * Google Map Initialiser
 */

    var _address = QueryString.address,
        _range = parseFloat(QueryString.range),
        _artist = "";
    if(exists(QueryString.artist)){ _artist = QueryString.artist.replace('%20', ' '); }

    /*
     *  get user's location:
     */
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded',
        url: "https://freegeoip.net/json/",
        timeout: 400,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        error: function(jqxhr, status, err) {
            ip_latitude = 48.8588589;
            ip_longitude = 2.3470599;
            newGoogleMap(ip_latitude, ip_longitude);
        },
        success: function(result) {
            console.log(result.ip);
            ip_latitude = result.latitude;
            ip_longitude = result.longitude;
            newGoogleMap(ip_latitude, ip_longitude);
        } });

    if (_address && _range) {
        update_params(_address, _range, _artist);
        geoCodeAddress(_address, _range, _artist);
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
    var latitude = position.coords.latitude,
        longitude = position.coords.longitude,
        range = parseFloat($('#range').slider('value')),
        artist = document.getElementById('artist').value;
    reverseGeocoding(latitude, longitude, range, artist);
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
function reverseGeocoding(lat, lng, range, artist) {
    var geocoder = new google.maps.Geocoder();
    var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    geocoder.geocode({"latLng" : point }, function(data, status) {
            if (status == google.maps.GeocoderStatus.OK && data[0]) {
                document.getElementById("address").value = data[0].formatted_address;
                update_url(data[0].formatted_address, range, artist);
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
                update_url(address, range, artist);
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
    var encodedURL = encodeURIComponent(document.URL+response.artist);
    var image_252 = 'http://userserve-ak.last.fm/serve/252/'+response["_id"]+'.jpg'
    summary = response.artist+' - '+response.startDate+' - '
                    +response.address.name+', '+response.address.street + ', '
                    +response.address.postalcode+', '+response.address.city+', '
                    +response.address.country,

        fb_share = '<a href="https://www.facebook.com/sharer/sharer.php?s=100&p[url]='
                    +encodedURL+'&p[title]='+response.title+'&p[summary]='
                    +summary+'&p[images][0]='+image_252
                    +'" target="_blank"><img width="25" src="images/fb_1.png"'
                    +'alt"=Share On Facebook title="Share On Facebook"/></a>',

        tw_share = '<a href="https://twitter.com/share?url='+encodedURL+'&text='+response.title
                    +'+'+response.artist+'&via=ConcertDaCote&related=concertdacote,ConcertDaCote,'
                    +'" target="_blank"><img width="25" src="images/twitter_1.png"'
                    +'alt="Share On Twitter" title="Share On Twitter"/></a>',

        lastfm = '<a target="_blank" href ='+response.url
                    +'><img width="25" src="images/lastfm.png" alt="More Info On Last.fm"'
                    +'title="More Info On Last.fm"/></a>',
        gplus = '<a href="https://plus.google.com/share?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/google_plus.png"'
                    +'alt="Share on G+" title="Share On Google+"/></a>',
        su = '<a href="http://stumbleupon.com/submit?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/stumble_upon.png"'
                    +'alt="Stumble" title="Stumble"/></a>';
    var loc = new google.maps.LatLng(response.latlong[0], response.latlong[1]);
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: response.title
    });
    oms.addMarker(lemarqueur);
    var WindowOptions = { content:'<table><tr><td><img src="'
    +response.image+'"/></td><td><div class="info-window-title">'
    +response.title+'</div><div class="info-window-body"><b>Artists: </b>'
    +response.artist+'<br><b>Date: </b>'+new Date(response.startDate).toLocaleString()+'<br>'
    +response.address.name+' '+response.address.street + '<br>'
    +response.address.postalcode+', '+response.address.city+', '+response.address.country
    +'</div></td></tr><tr><td></td><td>'+lastfm+'\t'+fb_share+'\t'+tw_share+'\t'+gplus
    +'\t'+su+'</td></tr></table>' };
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
    var pinImage = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
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
    var date = new Date();
    var _responseJSON;
    $.ajax({
        type : 'GET',
        url : '/concert?lat='+lat+'&long='+lng+'&range='+range+'&artist='+artist+'&date='+date,
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {
            console.log(JSON.stringify(err) + " " + JSON.stringify(status));},
        success : function(data, status) {
            if(data && typeof data === "string" && data !== null){
                _responseJSON = JSON.parse(data);
                plotOverlay(lat, lng, _responseJSON);
            } else {
                plotOverlay(lat, lng, data);
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

/*
 *  Update Form fields
 */
function update_params (address, range, artist) {
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