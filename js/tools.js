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
$(document).ready(function() {
$( "#range" ).slider({
        range: false,
        min: 1,
        max: 500,
        step: 1,
        values: [5],
        animate : "slow",
        slide: function( event, ui ) {
                $( "#amount" ).val(ui.values[0] + " Km");
                }
            });
$( "#amount" ).val($( "#range" ).slider( "values", 0 ) + " Km");
        //get rayon value
        //rayon = $("#rayon").slider("values", 0);
});