#!/usr/bin/env node

var util = require('util');
var request = require('request');

function getinfo() {
    var apiKey = '&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1';
    var location = '&limit=1&location=paris'
    var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents'+ location+apiKey+'&format=json';

    request(url, function(err, res, results) {    
    var chunk= '';
    var parsedJSON = '';
    var myobject = '';

    if(!err){
        console.log(results);
        console.log("-------------");
        parsedJSON = JSON.parse(results);
        myobject = parsedJSON.events.event[0];
        console.log("myobject: " + parsedJSON.events.event.number);
        //callMongo(parsedJSON);
    }
    else
    console.log('error occured');
});
}

function callMongo(data) {
    var testMongo = require('./test-mongo');
    testMongo.nodeMongo(data);
}

getinfo();