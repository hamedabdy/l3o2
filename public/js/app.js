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


/**
 * METHODS
 */
/*
 * Google Reverse Geocoder
 */
function reverseGeocode (latlng, fn) {
    var geocoder = new google.maps.Geocoder();
    var point = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
    geocoder.geocode({"latLng" : point }, function(data, status) {
        if (status == google.maps.GeocoderStatus.OK && data[0]) 
            return fn(data[0].formatted_address, null);
        else 
            return fn(null, status);
    });
}

/**
 * Google Geocoder : convert address to geo coordinates.
 * input: textual address
 * output: [latitude, longitude]
 */
function geocodeAddress(address, fn) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ "address" : address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latlng = results[0].geometry.location + "",
            tab_latlng = latlng.split(',');
            lat = parseFloat(tab_latlng[0].replace('(', ''));
            lng = parseFloat(tab_latlng[1].replace(')', ''));
            return fn( [lat, lng], null);
        } else return fn(null, status);
    });
}

/**
 * Update windows url upon clicking on a tile.
 */
function updateUrl (lat, lng, range, artist) {
    window.history.pushState("", "", "?lat="+lat+"&lng="+lng+"&range="
        +range+"&artist="+artist);
};

/**
 * Equivalent to updateUrl
 */
function assignUrl (lat, lng, range, artist) {
    location.assign('/m?lat='+lat+'&lng='+lng+'&range='+range+'&artist='+artist);
};

/**
 * Incoming trafic from a url with params, form is filled in using params
 */
function updateFormFields (address, range, artist) {
    document.getElementById("address").value = decodeURIComponent(address);
    document.getElementById("artist").value = artist;
    $('#range').slider('value', range);
};

/**
 * Utility function to fill a var with a default value in case of undefined
 */
function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; };

/**
 * Convert IP to geographical location using 3rd-party site
 */
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

/**
 * Helper function: print alert messages on screen in HTML
 */
function printMsg(message) {
    $('#alert-msg').html(message);
    $('#alert-msg').delay(7000).slideUp('fast');
}


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

/*
 * Open mini window for each social share button
 */
$('.shareBtns').children('a').on('click', function(e){
        e.preventDefault();
        var e = 575,
            f = 520,
            g = (jQuery(window).width() - e) / 2,
            h = (jQuery(window).height() - f) / 2,
            i = "status=1,width=" + e + ",height=" + f + ",top=" + h + ",left=" + g;
        window.open($(this).attr("href"), "Le Concert d'a Coté", i);
    });

// ------------ END of METHODS


// -------------  TOOLS  --------------

// Text overflow detection
$('.tile-title').each(function(i, e) {
    if (e.scrollWidth > $(e).innerWidth()) {
        $(this).find('div').addClass(' tile-txt ');
    }
});

// Clear button for inputs
$("#artist, #address").change(function(){
    $(this).next().css('display', 'initial');
});

$('[class*=clear-').on('click', function(){
    $(this).prev().val('');
    $(this).css('display', 'none');
});

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
        max: 150,
        value: 20,
        animate : "slow",
        slide: function() {
                $( "#amount" ).val($( "#range" ).slider( "value" ) + " km");
                },
        change: function() {
                $( "#amount" ).val($( "#range" ).slider( "value" ) + " km");
                }
            });
$( "#amount" ).val($( "#range" ).slider( "value" ) + " km");

/*
 * Right slider Pane
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
// ------------ End of right pane:

/**
 * Retreive unknown event address from user using Google Geolocation
 */
$( '.tile' ).on( 'click', function(e){
    if($(this).attr('id') != 'undefined') {
        if ($(this).find( '#location' ).html() == 'No address provided') {
            var id = $(this).attr('id');
            var lat = $(this).attr('data-lat');
            var lng = $(this).attr('data-lng');
            reverseGeocode([lat, lng], function(results, err){
                if(err == null) {
                    $.ajax({
                        method: 'PUT',
                        url: '/location',
                        data: { '_id' : id, address: results },
                    });
                }
            });
        }
    }
});
// ------------------------------

// Action taken before Form submission
$( '#valider' ).on('click', function(e){
    e.preventDefault();
    var address = $( '#address' ).val();
    $('#amount').val(parseFloat($('#range').slider('value')));
    if(address != '') {
        geocodeAddress(address, function(results, err) {
            if (err == null) {
                $('#lat').val(results[0]);
                $('#lng').val(results[1]);
                $('#myForm').submit();
            } else printMsg("Sorry couldn't find the given address!");
        });
    }
});

// Geolocation button, on press submits form
$( '#geolocate' ).on( 'click', function(e){
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude
            , lng = position.coords.longitude;
            $('#amount').val(parseFloat($('#range').slider('value')));
            $('#lat').val(parseFloat(lat));
            $('#lng').val(parseFloat(lng));
            $('#myForm').submit();
        });
    }
    else printMsg("Your browser does not support HTML5 Geolocation!");
});

/**
 * Initialze a new GMap using geo coords (inside map view)
 */
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
/**
 * Initialize user location on GMap
 */
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
        var pinImage = new google.maps.MarkerImage("images/pin01.png"
            , new google.maps.Size(17, 24)
            , new google.maps.Point(0, 0)
            , new google.maps.Point(10,34));
        var marqueur = new google.maps.Marker({
            position : new google.maps.LatLng(query.lat, query.lng),
            map : carte,
            icon : pinImage
        });
        var myWindowOptions = { content : '<h5>Your Location</h5>'};
        var myInfoWindow = new google.maps.InfoWindow(myWindowOptions);
        google.maps.event.addListener(marqueur, 'click', function() {
            myInfoWindow.open(carte, marqueur);
        });
        reverseGeocode([query.lat, query.lng], function(results, err){
            if (err == null)
                updateFormFields(results, query.range, query.artist);
        });
        plotOverlays(carte, query.lat, query.lng, concerts);
    });
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
    var pinImage = new google.maps.MarkerImage("images/pin03.png"
        , new google.maps.Size(32, 37)
        , new google.maps.Point(0, 0)
        , new google.maps.Point(15,34));
    var lemarqueur = new google.maps.Marker({
        position: loc,
        title: concerts.title,
        icon : pinImage
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
    var _content = '<div class="info-window-body"><span class="helper"></span><img style="max-width: 200px; max-height: 200px;" src="'+(concerts.img).replace("http:", "")+'" title="'+concerts.title+'" alt="'+imageAlt+'" onerror="this.src=\'images/noimage.png\'"/><div class="tile-info info-window-info"><div class="tile-title info-window-title" title="'+concerts.title+'">'+title+'</div><div class="tile-body"><b>Artists: </b><span>'+artists+'</span><br><b>Date: </b>'+date+'<br><span>'+concerts.address+'</span></div><div class="shareBtns">'+share.fb_share+share.tw_share+share.gplus+share.su+share.extLink+'</div></div></div>';
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
    } else printMsg('No conerts found at this time for the given parameters (range/address/artist)');

};