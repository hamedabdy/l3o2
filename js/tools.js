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
$(function() {
$( "#range" ).slider({
        range: "min",
        orientation: "horizontal",
        min: 10,
        max: 500,
        value: 5,
        animate : "slow",
        slide: function() {

                $( "#amount" ).val($( "#range" ).slider( "value") + " km");
                },
        change: function() {
                $( "#amount" ).val($( "#range" ).slider( "value") + " km");
                }
            });
$( "#amount" ).val($( "#range" ).slider( "value") + " km");
});
