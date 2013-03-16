#!/usr/bin/env node

var fs = require('fs');
var request = require('request');

//var initiate = require('./initiate-request');
//var totalPages = initiate.totalPages;
//console.log('totalpages: '+totalPages);

//used for inspect method to go through lasfm geo.getEvent API JSON tree
//var util = require('util');


//TODO:
//here goes an JSON file that contains names of cities that program would fetch info for
//here goes a for loop to gather info for every city in CITIESJSON

function getAttr(url, callback){
    var parsedRslts ='';
    var totalPages = 0;
    var perPage = 0;
    var page = 0;    
    //var url1 = '';
    request(url, function(err, res, results){
        //console.log(results);
        parsedRslts = JSON.parse(results);
        totalPages = parsedRslts.events['@attr'].totalPages;
        perPage = parsedRslts.events['@attr'].perPage;
        page = parsedRslts.events['@attr'].page;
        console.log("total pages to process: " + totalPages);
        console.log("number of results per page: " + perPage);
        
        for(page=1; page<= totalPages; page++){
            getConcerts(url, page);
            //console.log("p= " + p + ' \n url= ' + url+p);
        }
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

function pushEvents(parsedJSON, outputFileName, callback){
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
    };
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

function getConcerts(url, page){
    //for(i=1; i<=totalPages; i++){
    request(url+page, function(err, res, results) {
        var parsedJSON = '';
        var outputFileName = './concerts/concertsPage='+page+'.json';
        parsedJSON = JSON.parse(results);
        //console.log("results: " + util.inspect(parsedJSON));
        pushEvents(parsedJSON, outputFileName, writeJsonToFile);
    });
    //};
};

var url1 = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=paris&limit=100&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url1, function(err, res, results){
    var parsedRslts ='';
    var totalPages = 0;
    var perPage = 0;
    var page = 0;
    var url = '';
    
    //chunk to store info captured from LastFm
    var chunk= '';
    //var to store parsed chunk info
    var parsedJSON = '';
    //var to store each parsed selection (object) from captured info
    var myobject = '';
    //for testing stage
    //storing all useful information on concerts HTML DATA
    var parsedChunk = '';
    //storing concert information on jsonObj
    //var jsonObj = {};
    events = {};
    events.event = [];
    
    //creating output file to save json
    var outputFileName = './concert.json';
    //variable for storing stringify JSON
    var jsonStringify = '';
    
    if(!err){
        //console.log(results);
        parsedRslts = JSON.parse(results);
        totalPages = parsedRslts.events['@attr'].totalPages;
        perPage = parsedRslts.events['@attr'].perPage;
        page = parsedRslts.events['@attr'].page;
        console.log("total pages to process: " + totalPages);
        console.log("number of results per page: " + perPage);

    for(j=1; j<totalPages; j++){    
        console.log("page number request sent: " + j);*/
        url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=paris&limit=100&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json&page=';
        //console.log(url);
        getAttr(url, getConcerts);
