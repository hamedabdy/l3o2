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
            console.log('artists: ' + util.inspect(myobject.artists));
    }
    else 
    console.log('error occured');
});
