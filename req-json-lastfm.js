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
};

function getAttr(url, callback){
    var parsedRslts ='';
    var totalPages = 0;
    var perPage = 0;
    var page = 0;
    var location ='';
    request(url, function(err, res, results){
        //console.log(results);
        parsedRslts = JSON.parse(results);
        //console.log('parsedrslts: ' + util.inspect(parsedRslts.error));
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
        //console.log("number of results per page: " + perPage);
        //for(page=1; page<= total; page++){
            getConcerts(url, total, location);
            //console.log("p= " + p + ' \n url= ' + url+p);
        };
    });
};

function writeJsonToFile(jsonStringify, outputFileName){
    //writing them into file
    fs.writeFile(outputFileName, jsonStringify, function(err) {
        if(err) {
            console.log(err);
        } else
            console.log("JSON saved to " + outputFileName);
    });
};

function pushEvents(parsedJSON, outputFileName, location, total, callback){
    var myobject = '';
    var jsonStringify = '';
    var events = {};
    events.event = [];
    var legnth =0;
        length = (parsedJSON.events.event).length;
        //console.log('length: ' + length); 
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
        //console.log(jsonStringify);
        writeJsonToFile(jsonStringify, outputFileName);
};

function htmlEvents(myobject){
    var parsedChunk = '';
        //for testing stage
        //Data to be shown in html page   
        parsedChunk += '<hr> Number: ' + i + '<hr> ID: ' + myobject.id + '<hr>Title: ' + myobject.title + '<br> Artists: ' + myobject.artists.artist;
        parsedChunk += '<hr> Address: ' + myobject.venue.name + '<br>' + myobject.venue.location.street + '<br>' + myobject.venue.location.postalcode;
        parsedChunk += ' ' + myobject.venue.location.city + ' ' + myobject.venue.location.country;
        parsedChunk += '<hr>Latitude: ' + myobject.venue.location['geo:point']['geo:lat'] +'<br> Longitude: '+ myobject.venue.location['geo:point']['geo:long'];
        parsedChunk += '<hr>URL: ' + myobject.url + '<hr>Date and Time: ' + myobject.startDate;
        //console.log('parsedchunk: ' + parsedChunk);
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
};

function getConcerts(url, limit, location){
    var url2 = url + '&limit=' + limit;
    console.log('url: ' +url2);
    request(url2, function(err, res, results) {
        var parsedJSON = '';
        var outputFileName = './concerts/('+location+')concerts.json';
        parsedJSON = JSON.parse(results);
        //console.log("results: " + util.inspect(parsedJSON));
        pushEvents(parsedJSON, outputFileName, location, limit, writeJsonToFile);
    });
};

url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';
iterateCities(url, villes);
