 var geocoder;
var map;
 function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-33.8688, 151.2195),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map_canvas'),
          mapOptions);

        var input = document.getElementById('address');
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // Inform the user that the place was not found and return.
            input.className = 'notfound';
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          var image = new google.maps.MarkerImage(
              place.icon,
              new google.maps.Size(71, 71),
              new google.maps.Point(0, 0),
              new google.maps.Point(17, 34),
              new google.maps.Size(35, 35));
          marker.setIcon(image);
          marker.setPosition(place.geometry.location);
        });
      }

      function codeAddress() {

        if (document.getElementById('titre').value=="" || document.getElementById('artist').value=="" || document.getElementById('address').value=="" || document.getElementById('date').value==""){
                  alert('Merci de remplir tous les champs obligatoires');
                  //return false;
                }
                else {
  var address = document.getElementById('address').value;

  
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      
      var latlng = results[0].geometry.location + "",
      tab_latlng = latlng.split(','),
                latitude = tab_latlng[0].replace('(', ''),
                longitude = tab_latlng[1].replace(')', '');
                
                latitude = parseFloat(latitude);
                longitude = parseFloat(longitude);
                
                document.getElementById('lat').value = latitude;
                document.getElementById('long').value = longitude;
               
                
                  //alert( "Lat = "+ document.getElementById('lat').value);
                  document.forms['myform'].submit();
                  //return true
               

                
    } else {
      alert('Vous devez saisir une adresse postale valide ! \n Geocode was not successful for the following reason: ' + status);
      //return false;
    }
  });
}
}
      google.maps.event.addDomListener(window, 'load', initialize)
      