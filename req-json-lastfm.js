#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var villes = require('./liste-villes');
console.log('*** Total number of cities to process= ' + villes.france.length + ' ***');

var errorChunk ='';
    
function iterateCities(url, cities){
    for(i=0; i<cities.france.length; i++){
        url1 = url + '&location=' + cities.france[i] + ',france';
        getAttr(url1, cities.france[i]);
    };
}

function getAttr(url, city){
    var parsedRslts ='';
    var total = 0;
    var location ='';
    request(url, function(err, res, results){
        parsedRslts = JSON.parse(results);
        if(parsedRslts.error){
            errorChunk += ' '+ city + ', ';
            //console.log('\n***error could not fetch results for '+city+'!***\n');
        }
        else {
        total = parsedRslts.events['@attr'].total;
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

function pushEvents(parsedJSON, location, total){
    var myobject = '';
    //var events = {};
    event = [];
    var legnth =0;
        length = (parsedJSON.events.event).length;
        //creating JSON
    for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];
    //adding data to JSON
    event.push({
        number : i+1,
        title : myobject.title,
        artist : myobject.artists.artist,
        address : {name: myobject.venue.name, street : myobject.venue.location.street,
                    postalcode : myobject.venue.location.postalcode,
                    city : myobject.venue.location.city, country : myobject.venue.location.country},
                    'geo:lat' : myobject.venue.location['geo:point']['geo:lat'],
                    'geo:long' : myobject.venue.location['geo:point']['geo:long'],
        url : myobject.url,
        startDate : myobject.startDate,
        website : myobject.website
        });
    };
    //events['@attr'] = {"location": location, "total" : total};
        callMongo(event, location);
}

function getConcerts(url, limit, location){
    var url2 = url + '&limit=' + limit;
    console.log('url: ' +url2 + '\n');
    request(url2, function(err, res, results) {
        var parsedJSON = '';
        //var outputFileName = './concerts/('+location+')concerts.json';
        parsedJSON = JSON.parse(results);
        pushEvents(parsedJSON, location, limit);
    });
}

function callMongo(data, location) {
    var nodeGo = require('./node-mongodb');
    console.log('processing database for: ' + location);
    nodeGo.openClient(data);
}

function showErrors(errors) {
    console.log('\n***error could not fetch results for these cities :' + errors + '***\n');

}

var apiKey = 'dbc287366d92998e7f5fb5ba6fb7e7f1';
var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key='+apiKey+'&format=json';
iterateCities(url, villes);
showErrors(errorChunk);
