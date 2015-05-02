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
                    +'" target="_blank"><img width="25" src="images/fb_1.png"'
                    +'alt"=Share On Facebook title="Share On Facebook"/></a>';
        shareBtns.tw_share = '<a href="https://twitter.com/share?url='+encodedURL+'&text='+data.title
                    +'+'+data.artist+'&via=ConcertDaCote&related=concertdacote,ConcertDaCote,'
                    +'" target="_blank"><img width="25" src="images/twitter_1.png"'
                    +'alt="Share On Twitter" title="Share On Twitter"/></a>';
        shareBtns.lastfm = '<a target="_blank" href ='+data.url
                    +'><img width="25" src="images/lastfm.png" alt="More Info On Last.fm"'
                    +'title="More Info On Last.fm"/></a>';
        shareBtns.gplus = '<a href="https://plus.google.com/share?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/google_plus.png"'
                    +'alt="Share on G+" title="Share On Google+"/></a>';
        shareBtns.su = '<a href="http://stumbleupon.com/submit?url=' + encodedURL 
                    +'" target="_blank"><img width="25" src="images/stumble_upon.png"'
                    +'alt="Stumble" title="Stumble"/></a>';
        return fn(shareBtns);
}

/*
 * Draw tiles into index tiles-box
 */
function drawTiles (data) {
    for (i=0; i<data.length; i++) {
        var d = data[i];
        var share = {};
        shareButtons(d, function(shareBtns) { share = shareBtns; });
        var helper = '<span class="helper"></span>';
        var cover = (d.image).replace("/64/", "/126/");
        var img = '<img src="'+cover+'" title="'+d.title+'" alt="'+d.title+'"/>'
        var _address = d.address.name+' '
                    +d.address.street + ', '
                    +d.address.postalcode+', '
                    +d.address.city+', '
                    +d.address.country;
        var artists = String(d.artist).replace(/,/g, ", ");
        if (artists.length > 50)
            artists = artists.substr(0, 50) + ' ...';
        var _shareButtons = share.fb_share+share.tw_share+share.gplus+share.su+share.lastfm;
        var info = '<div class="tile-info"><div class="tile-title">'
                    +d.title+'</div><div class="tile-body"><b>Artists: </b><span>'
                    +artists+'</span><br><b>Date: </b>'+new Date(d.startDate).toLocaleString()+'<br><span>'
                    +_address
                    +'</span></div><div class="shareBtns">'
                    +_shareButtons
                    + '</div></div>';
        var _artists = artists.split(',');
        var tile = '<a href="/?address='
                        +_address+'&range=10&artist='
                        +_artists[0]+'" class="tile-link"><div class="tile" id=tile'+i
                        +'></div></a>';
        $( '.tiles-box' ).append( tile );
        $( '#tile'+i ).append( helper );
        $( '#tile'+i ).append( img );
        $( '#tile'+i ).append( info );
    }
}

/*
 * Find IP location:
 */
function geoIpLocation () {
    $.ajax({
        type: "GET",
        url: "//freegeoip.net/json/",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "json",
        timeout: 3000,
        error: function(jqxhr, status, err) {
            ip_latitude = 48.8588589;
            ip_longitude = 2.3470599;
            // getTiles(ip_latitude, ip_longitude, 10, 15);
            // console.log(err + ", " + status);
            window.location.replace('/?lat='+ip_latitude+'&lng='+ip_longitude);
        },
        success: function(result) {
            ip_latitude = result.latitude;
            ip_longitude = result.longitude;
            // getTiles(ip_latitude, ip_longitude, 10, 15);
            window.location.replace('/?lat='+ip_latitude+'&lng='+ip_longitude);
        } 
    });
}

/*
 * AJAX call to server
 */
function getTiles(lat, lng, range, limit) {
    var date = new Date();
    var _responseJSON;
    $.ajax({
        type : 'GET',
        url : '/concert?lat='+lat+'&long='+lng+'&range='+range+'&date='+date+'&l='+limit,
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {
            console.log(JSON.stringify(err) + " " + JSON.stringify(status) 
                + " " + JSON.stringify(jqxhr));
        },
        success : function(data, status) {
            if(data && typeof data === "string" && data !== null){
                _responseJSON = JSON.parse(data);
                drawTiles(_responseJSON);
            } else {
                drawTiles(data)
            }
        }
    });
}

// geoIpLocation()