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
    var image_252 = (data.image).replace("/64/", "/252/")
        , summary = data.artist+' - '+new Date(data.startDate).toLocaleString()+' - '
                    +data.address.name+', '+data.address.street + ', '
                    +data.address.postalcode+', '+data.address.city+', '
                    +data.address.country
        , shareBtns = {};
        shareBtns.fb_share = '<a href="https://www.facebook.com/sharer/sharer.php?s=100&p[url]='
                    +encodedURL+'&p[title]='+data.title+'&p[summary]='
                    +summary+'&p[images][0]='+image_252
                    +'" target="_blank"><img width="25" src="images/fb_1.png" '
                    +'alt="Share On Facebook" title="Share On Facebook"/></a>';
        shareBtns.tw_share = '<a href="https://twitter.com/share?url='+encodedURL+'&text='+data.title
                    +'+'+data.artist+'&via=ConcertDaCote&related=concertdacote,ConcertDaCote,'
                    +'" target="_blank"><img width="25" src="images/twitter_1.png" '
                    +'alt="Tweet" title="Tweet"/></a>';
        shareBtns.lastfm = '<a target="_blank" href="'+data.url
                    +'"><img width="25" src="images/lastfm.png" alt="More Info On Last.fm"'
                    +'title="More Info On Last.fm"/></a>';
        shareBtns.gplus = '<a href="https://plus.google.com/share?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/google_plus.png" '
                    +'alt="Share on G+" title="Share On Google+"/></a>';
        shareBtns.su = '<a href="http://stumbleupon.com/submit?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/stumble_upon.png" '
                    +'alt="Stumble" title="Stumble"/></a>';
        return fn(shareBtns);
}
