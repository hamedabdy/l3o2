#!/usr/bin/env node
//used for inspect method to go through lasfm geo.getEvent API JSON tree
//var util = require('util');
var fs = require('fs');
var request = require('request');
var villes = require('./liste-villes');
console.log('*** Total number of cities to process= ' + villes.france.length + ' ***');

function iterateCities(url, cities, callback){
    for(i=0; i<cities.france.length; i++){
        url1 = url + '&location=' + cities.france[i] + ',france';
        getAttr(url1, getConcerts);
    };
}

function getAttr(url, callback){
    var parsedRslts ='';
    var totalPages = 0;
    var perPage = 0;
    var page = 0;
    var location ='';
    request(url, function(err, res, results){
        parsedRslts = JSON.parse(results);
        if(parsedRslts.error){
            console.log('***error occured in getAttr***');
        }
        else {
        total = parsedRslts.events['@attr'].total;
        perPage = parsedRslts.events['@attr'].perPage;
        page = parsedRslts.events['@attr'].page;
        location = parsedRslts.events['@attr'].location;
        console.log('location: ' + location);
        console.log("total concerts in this city to process: " + total);
            getConcerts(url, total, location);
        };
    });
}

function writeJsonToFile(jsonStringify, outputFileName){
    fs.writeFile(outputFileName, jsonStringify, function(err) {
        if(err) {
            console.log(err);
        } else
            console.log("JSON saved to " + outputFileName);
    });
}

function pushEvents(parsedJSON, outputFileName, location, total, callback){
    var myobject = '';
    var jsonStringify = '';
    var events = {};
    events.event = [];
    var legnth =0;
        length = (parsedJSON.events.event).length;
        //creating JSON
    for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];
    //adding data to JSON
    events.event.push({
        number : i+1,
        title : myobject.title,
        artist : myobject.artists.artist,
        address : {name: myobject.venue.name, street : myobject.venue.location.street, postalcode : myobject.venue.location.postalcode,
                    city : myobject.venue.location.city, country : myobject.venue.location.country,
                    'geo:point' : { 'geo:lat' : myobject.venue.location['geo:point']['geo:lat'], 'geo:long' : myobject.venue.location['geo:point']['geo:long']}},
        url : myobject.url,
        startDate : myobject.startDate,
        website : myobject.website
        });
    };
    events['@attr'] = {"location": location, "total" : total};
    //events contains some information in JSON (non-stringify-d)
        //jsonStringify stores stringify-d events
        jsonStringify = JSON.stringify(events, null, 4);
        writeJsonToFile(jsonStringify, outputFileName);
}

function getConcerts(url, limit, location){
    var url2 = url + '&limit=' + limit;
    console.log('url: ' +url2);
    request(url2, function(err, res, results) {
        var parsedJSON = '';
        var outputFileName = './concerts/('+location+')concerts.json';
        parsedJSON = JSON.parse(results);
        pushEvents(parsedJSON, outputFileName, location, limit, writeJsonToFile);
    });
}

url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';
iterateCities(url, villes);
