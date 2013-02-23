#!/usr/bin/env node

var request = require('request');
var util = require('util');

var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=madrid&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url, function(err, res, results) {
    
    var chunk= '';
    var parsedJSON = '';
    var myobject = '';
    
    if(!err){
        console.log(results);
        console.log("-------------");
        chunk += results;
        parsedJSON = JSON.parse(chunk);
        myobject = parsedJSON.events.event[0];
            console.log('id: ' + myobject.id);
            console.log('title: ' + myobject.title);
            console.log('artists: ' + myobject.artists.artist);
            console.log('address: ' + myobject.venue.name + '\n' + myobject.venue.location.street + '\n' + myobject.venue.location.postalcode + ' ' + myobject.venue.location.city + ' ' + myobject.venue.location.country);
            console.log('latitude: ' + myobject.venue.location['geo:point']['geo:lat'] +' longitude: '+ myobject.venue.location['geo:point']['geo:long']);
            console.log('URL: ' + myobject.url);
            console.log('Date and Time: ' + myobject.startDate);
            if(myobject.website != '')
            console.log('WebSite: ' + myobject.website);
            else
            console.log('Website: none provided');
            
    }
    else 
    console.log('error occured');
});
