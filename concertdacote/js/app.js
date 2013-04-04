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
 * GeoLocalization
 */
function geoLocate() {
    if (navigator.geolocation)
        var watchId = navigator.geolocation.watchPosition(successCallback, null, { enableHighAccuracy : true});
    else
        alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
}

function successCallback(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;		
    reverseGeocoding(lat, lng);
    setUserLocation(lat, lng);
}

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
                alert("Erreur: " + status);
            }
        });
    return false;
}

/*
 * Geocoding
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
                alert("Aucune Adresse de ce type n'existe");
            }
        });
    }
}


function newPoint(carte, response, i ){
    var lemarqueur = new google.maps.Marker({
    position: new google.maps.LatLng(parseFloat(response.latlong[0]), parseFloat(response.latlong[1])),
    map: carte,
    title: response.title
    });
    var WindowOptions = { content:'<table><tr><td><img src="'+response.image+'"/></td><td><p style="font-size: 13px">'+response.title+'</p> <p style="font-size: 10px"><b>Artistes:</b> '+response.artist+'<br><b>Date:</b> '+response.startDate+'<br><a target="_blank" href ='+response.url+'>Plus d\'infos</a></p></td></tr></table>'};
    var InfoWindow = new google.maps.InfoWindow(WindowOptions);
    google.maps.event.addListener(lemarqueur, 'click', function() {
        InfoWindow.open(carte,lemarqueur);
    });
}


function plotOverlay(lat, lng, response) {
    var latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
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
    var pinColor = "#79CDCD";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
                                    + pinColor, new google.maps.Size(21, 34),
                    new google.maps.Point(0, 0), new google.maps.Point(10,34));

    var marqueur = new google.maps.Marker({
            position : new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
            map : carte,
            title : "Vous etes ici",
            icon : pinImage
    });

    var myWindowOptions = {
            content : '<h4>Vous etes ici</h4>'
    };

    var myInfoWindow = new google.maps.InfoWindow(myWindowOptions);
    google.maps.event.addListener(marqueur, 'click', function() {
            myInfoWindow.open(carte, marqueur);
    });
    
    for (var i = 0 ; i < response.length; i++) {
            newPoint(carte, response[i], i);
    };  
}

//c'est ma fonction qui actualise la maps a chaque fois qu'on click dessus !
//pour tester mettez bien des cordonnées qui son en france!!!
function getConcerts(lat, lng, rayon) {
    $.ajax({
        type : 'POST',
        url : '/concert?lat=' + parseFloat(lat) + '&long='+ parseFloat(lng) + '&rayon='+ parseFloat(rayon),
        dataType : 'json',
        contentType : 'application/json',
        error: function(e) {console.log(e);},
        success : function(response) {
           plotOverlay(lat, lng, response);
        }
    });
}

$(document).ready(function() {
$( "#rayon" ).slider({
        range: false,
        min: 1,
        max: 200,
        values: [50],
        slide: function( event, ui ) {
                $( "#amount" ).val(ui.values[0] + " Km");
                }
            });
$( "#amount" ).val($( "#rayon" ).slider( "values", 0 ) + " Km");
        //get rayon value
        //rayon = $("#rayon").slider("values", 0);
});