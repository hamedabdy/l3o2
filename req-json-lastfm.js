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
    var jsonStringify = '';
    
    if(!err){
        //console.log(results);
        chunk += results;
        parsedJSON = JSON.parse(chunk);
        
        var legnth;
        length = (parsedJSON.events.event).length;
        //console.log('length: ' + length);
        
        //creating JSON
        jsonObj.events = {};
        jsonObj.events.event = [];
        for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];
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
        //Data to be shown in html page   
        parsedChunk += '<hr> Number: ' + i + '<hr> ID: ' + myobject.id + '<hr>Title: ' + myobject.title + '<br> Artists: ' + myobject.artists.artist;
        parsedChunk += '<hr> Address: ' + myobject.venue.name + '<br>' + myobject.venue.location.street + '<br>' + myobject.venue.location.postalcode;
        parsedChunk += ' ' + myobject.venue.location.city + ' ' + myobject.venue.location.country;
        parsedChunk += '<hr>Latitude: ' + myobject.venue.location['geo:point']['geo:lat'] +'<br> Longitude: '+ myobject.venue.location['geo:point']['geo:long'];
        parsedChunk += '<hr>URL: ' + myobject.url + '<hr>Date and Time: ' + myobject.startDate;
        //console.log('parsedchunk: ' + parsedChunk);
        
        //adding data to JSON
        jsonObj.events.event.push({
            id : myobject.id,
            title : myobject.title,
        artist : myobject.artists.artist,
        address : {name: myobject.venue.name, street : myobject.venue.location.street, postalcode : myobject.venue.location.postalcode,
                    city : myobject.venue.location.city, country : myobject.venue.location.country,
                    'geo:point' : { 'geo:lat' : myobject.venue.location['geo:point']['geo:lat'], 'geo:long' : myobject.venue.location['geo:point']['geo:long']}},
                    url : myobject.url,
                    startDate : myobject.startDate,
                    website : myobject.website
        });
        
        /*
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
        jsonObj.startDate = myobject.startDate; */
        
        if(myobject.website != ''){
            //console.log('WebSite: ' + myobject.website);
            parsedChunk += '<hr>WebSite: ' + myobject.website + '<hr>';
            //jsonObj.website = myobject.website;
            //jsonObj.events.event.push({ website : myobject.website }); //pushes website out of events!
        }
        else{
            //console.log('Website: none provided');
            parsedChunk += '<hr>WebSite: none provided' + '<hr>';
            //jsonObj.website = 'none provided';
            //jsonObj.events.event.push({ website : 'none provided' }); //pushes website out of events!
        }
        
        //jsonObj contains some information in json (non-stringify-d)
        //jsonStringify stores stringify-d jsonObj
        jsonStringify = JSON.stringify(jsonObj, null, 4);
        //console.log(jsonStringify);
        
        };
                
        //writing them into file
        fs.writeFile(outputFileName, jsonStringify, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFileName);
    }
        });
        
        
        //exporting stringify-d jsonObj
        exports.jsonStringify = jsonStringify;
        //exporting concert information
        exports.parsedChunk = parsedChunk;
        //console.log('json req-json-lastfm: ' + jsonStringify);
    }
    else 
    console.log('\n ***error occured in req-json-lastfm.js***');
});
