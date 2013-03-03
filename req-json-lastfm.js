#!/usr/bin/env node

var fs = require('fs');

var request = require('request');
var util = require('util');

var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=madrid&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url, function(err, res, results) {
    //chunk to store info captured from LastFm
    var chunk= '';
    //var to store parsed chunk info
    var parsedJSON = '';
    //var to store each parsed selection (object) from captured info
    var myobject = '';
    //storing all useful information on concerts
    var parsedChunk = '';
    //storing concert information on jsonObj
    var jsonObj = {};
    //creating output file to save json
    var outputFileName = './concert.json';
    //variable for storing stringify JSON
    var jsonExp = '';
    
    if(!err){
        //console.log(results);
        chunk += results;
        parsedJSON = JSON.parse(chunk);
        myobject = parsedJSON.events.event[0];
        
        /*
        console.log("-------------");
        console.log('id: ' + myobject.id);
        console.log('title: ' + myobject.title);
        console.log('artists: ' + myobject.artists.artist);
        console.log('address: ' + myobject.venue.name + '\n' + myobject.venue.location.street + '\n' + myobject.venue.location.postalcode + ' ' + myobject.venue.location.city + ' ' + myobject.venue.location.country);
        console.log('latitude: ' + myobject.venue.location['geo:point']['geo:lat'] +' longitude: '+ myobject.venue.location['geo:point']['geo:long']);
        console.log('URL: ' + myobject.url);
        console.log('Date and Time: ' + myobject.startDate);
        */
            
        parsedChunk += '<hr> id: ' + myobject.id + '<hr>title: ' + myobject.title + '<br> artists: ' + myobject.artists.artist + '<hr> address: ' + myobject.venue.name + '<br>' + myobject.venue.location.street + '<br>' + myobject.venue.location.postalcode + ' ' + myobject.venue.location.city + ' ' + myobject.venue.location.country + '<hr>latitude: ' + myobject.venue.location['geo:point']['geo:lat'] +'<br> longitude: '+ myobject.venue.location['geo:point']['geo:long'] + '<hr>URL: ' + myobject.url + '<hr>Date and Time: ' + myobject.startDate;
        //console.log('parsedchunk: ' + parsedChunk);
        
        //creating JSON and adding stuff to it
        jsonObj.id = myobject.id;
        jsonObj.title =  myobject.title;
        jsonObj.artist = myobject.artists.artist;
        jsonObj.address = {};
        jsonObj.address.name = myobject.venue.name;
        jsonObj.address.street = myobject.venue.location.street;
        jsonObj.address.postalcode = myobject.venue.location.postalcode;
        jsonObj.address.city = myobject.venue.location.city;
        jsonObj.address.country = myobject.venue.location.country;
        jsonObj.address['geo:point'] = {};
        jsonObj.address['geo:point']['geo:lat'] = myobject.venue.location['geo:point']['geo:lat'];
        jsonObj.address['geo:point']['geo:long'] = myobject.venue.location['geo:point']['geo:long'];
        jsonObj.url = myobject.url;
        jsonObj.startDate = myobject.startDate;
        if(myobject.website != ''){
            //console.log('WebSite: ' + myobject.website);
            parsedChunk += '<hr>WebSite: ' + myobject.website;
            jsonObj.website = myobject.website;
        }
        else{
            //console.log('Website: none provided');
            parsedChunk += '<hr>WebSite: none provided';
            jsonObj.website = 'none provided';
        }
        
        jsonExp = JSON.stringify(jsonObj, null, 8);
        console.log(jsonObj);
        
        //writing them into file
        fs.writeFile(outputFileName, jsonExp, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFileName);
    }
        });
        
        exports.jsonObj = jsonObj;
        exports.jsonExp = jsonExp;
        //exporting concert information
        exports.parsedChunk = parsedChunk;
        //console.log('json: ' + json);
    }
    else 
    console.log('error occured');
});
