/*
 * Google Analytics
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-40498004-4', 'auto');
ga('send', 'pageview');

// ------------- CLASSIE.JS -----------

/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
};

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
};

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
};

window.classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

})( window );

// -------------  TOOLS  --------------

/*
 * Address AutoComplete JQuery
 */
$(document).ready(function() {
    //Init Geocoder
    var geocoder = new google.maps.Geocoder();
    //Autocomplete
    $('input#address').autocomplete({
        source : function(request, response) {
            geocoder.geocode({
                    'address' : $('input#address').val()
            }, function(results, status) {
                response($.map(results, function(item) {
                    return {
                        value : item.formatted_address
                    }
                }));
            });
        },
        select : function(event, ui) {
            $('input#address').val(ui.item['value']);
        },
        minLength : 2
    });
});

/*
 * Range Slider JQuery
 */
$( "#range" ).slider({
        range: "min",
        orientation: "horizontal",
        min: 5,
        max: 500,
        value: 10,
        animate : "slow",
        slide: function() {
                $( "#amount" ).val($( "#range" ).slider( "value" ) + " km");
                },
        change: function() {
                $( "#amount" ).val($( "#range" ).slider( "value" ) + " km");
                }
            });
$( "#amount" ).val($( "#range" ).slider( "value" ) + " km");

/**
 * Method to construct neccessary share buttons from given data(concert) and url
 */
function shareButtons (data, fn) {
    var encodedURL = encodeURIComponent(document.URL+data.artist);
    var summary = data.artist+' - '+new Date(data.startDate).toLocaleString()+' - '+data.address
        , shareBtns = {};
        shareBtns.fb_share = '<a href="https://www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodedURL+'&p[title]='+data.title+'&p[summary]='+summary+'&p[images][0]='+data.img+'" target="_blank"><img width="25" src="images/fb_1.png" '+'alt="Share On Facebook" title="Share On Facebook"/></a>';
        shareBtns.tw_share = '<a href="https://twitter.com/share?url='+encodedURL+'&text='+data.title+'+'+data.artist+'&via=ConcertDaCote&related=concertdacote,ConcertDaCote,'+'" target="_blank"><img width="25" src="images/twitter_1.png" '+'alt="Tweet" title="Tweet"/></a>';
        shareBtns.extLink = '<a target="_blank" href="'+data.url+'"><img width="25" src="images/external_link.png" alt="External Link" title="Source site"/></a>';
        shareBtns.gplus = '<a href="https://plus.google.com/share?url='+encodedURL+'" target="_blank"><img width="25" src="images/google_plus.png" '+'alt="Share on G+" title="Share On Google+"/></a>';
        shareBtns.su = '<a href="http://stumbleupon.com/submit?url='+encodedURL+'" target="_blank"><img width="25" src="images/stumble_upon.png" '+'alt="Stumble" title="Stumble"/></a>';
        return fn(shareBtns);
};

// --------------------------

/*
 * Side bar
 */
var menuRight = document.getElementById( 'cbp-spmenu-s2' )
    , showRight = document.getElementById( 'showRight' )
    , infoBtn = document.getElementById( 'infoBtn' );

// Check browser support
if (typeof(Storage) != "undefined") {
    // Retrieve
    var storageState = localStorage.getItem("infoActive");
    if(!storageState) {
        options();
    }
} else {
    console.log("Sorry, your browser does not support Web Storage...");
};

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
};

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
};

/*
 * GeoLocalization, using html5 geolocalization
 */
function geoLocate() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(geoLocateCallback);
    else
        alert("Your browser does not support HTML5 Geolocation!");
};

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
};

function newGoogleMap(ip_latitude, ip_longitude, fn) {
    var latlng = new google.maps.LatLng(ip_latitude, ip_longitude);
    var options = {
            center : latlng,
            zoom : 11,
            mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carte"), options);
    return fn(carte);
};

function initLocation(query, concerts) {
    if(query) {
        // Setting default values to range and artist
        query.range = defaultFor(query.range, 10);
        query.artist = defaultFor(query.artist, '');
        setUserLocation(query, concerts);
    }
    else {
        ipLocation(function(err, r){
            if(r && r.status == 'success'){
                newGoogleMap(r.lat, r.lon, function(carte) {
                    // carte.panTo(new google.maps.LatLng(query.lat, query.lng));
                });
            } else {
                newGoogleMap(48.8588589, 2.3470599, function(carte) {
                    // carte.panTo(new google.maps.LatLng(48.8588589, 2.3470599));
                });
            }
        });
    }
}

/*
 * This fucntion sets the user location on the map. ref. geoLocateCallback()
 */
function setUserLocation(query, concerts) {
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
};

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
};

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
                latitude = parseFloat(tab_latlng[0].replace('(', '')),
                longitude = parseFloat(tab_latlng[1].replace(')', ''));
                range = parseFloat(range);
                updateUrl(latitude, longitude, range, artist);
                query = {lat : latitude, lng: longitude, range: range, artist: artist};
                getConcerts(latitude, longitude, range, artist, function(err, results){
                    if(!err) setUserLocation(query, results);
                });
            } else alert("Sorry couldn't find the given address!");
        });
    }
};

var infoWindows = [];

function closeInfoWindows(){
    var i = infoWindows.length;
    while(i--) { infoWindows[i].close(); }
};

/*
 * Map markers customization
 */
function newOverlay(carte, concerts, oms){
    var share = {};
    shareButtons(concerts, function(shareBtns){ share = shareBtns });
    var loc = new google.maps.LatLng(concerts.latlng[0], concerts.latlng[1]);
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: concerts.title
    });
    oms.addMarker(lemarqueur);
    var imageAlt = concerts.title;
    if (concerts.title.lenth > 13) imageAlt = concerts.title.substr(0, 13)+' ...';
    var title = concerts.title;
    if (concerts.title.length > 22) title = concerts.title.substr(0, 22) + ' ...';
    var artists = String(concerts.artist).replace(/,/g, ", ");
    if (artists.length > 50) artists = artists.substr(0, 50) + ' ...';
    var artists = artists.split(',');
    var date = new Date(concerts.startDate).toLocaleString(navigator.language, {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    var _content = '<div class="info-window-body"><span class="helper"></span><img style="max-width: 300px; max-height: 300px;" src="'+concerts.img+'" title="'+concerts.title+'" alt="'+imageAlt+'" onerror="this.src=\'images/noimage.png\'"/><div class="tile-info info-window-info"><div class="tile-title info-window-title" title="'+concerts.title+'">'+title+'</div><div class="tile-body"><b>Artists: </b><span>'+artists+'</span><br><b>Date: </b>'+date+'<br><span>'+concerts.address+'</span></div><div class="shareBtns">'+share.fb_share+share.tw_share+share.gplus+share.su+share.extLink+'</div></div></div>';
    var WindowOptions = { content: _content };
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    infoWindows.push(InfoWindow);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        closeInfoWindows();
        InfoWindow.open(carte,lemarqueur);
    });
    return lemarqueur;
};

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

};

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
};

function updateUrl (lat, lng, range, artist) {
    window.history.pushState("", "", "?lat="+lat+"&lng="+lng+"&range="
        +range+"&artist="+artist);
};

function assignUrl (lat, lng, range, artist) {
    location.assign('/m?lat='+lat+'&lng='+lng+'&range='+range+'&artist='+artist);
};

function updateFormFields (address, range, artist) {
    document.getElementById("address").value = decodeURIComponent(address);
    document.getElementById("artist").value = artist;
    $('#range').slider('value', range);
};

function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; };

function ipLocation(fn) {
    var url = '//ip-api.com/json/';
    $.ajax({
        type : 'GET',
        url : url,
        error: function(jqxhr, status, err) {
            console.log(JSON.stringify(err) + " " + JSON.stringify(status)
                + " " + JSON.stringify(jqxhr));
            return fn(err, null);
        },
        success : function(data, status) {
            return fn(null, data);
        }
    });
}