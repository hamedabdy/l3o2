#!/usr/bin/env node

var request = require('request');
var villes = require('../config/liste-villes');
var util = require('util');
var Encoder = require('node-html-encoder').Encoder;
var encoder = new Encoder('entity');

console.log('\n*** Total number of locations to process : ' + villes.city.length + ' ***\n');
console.log('*** Please be patient while sending requests this may take a while... ****\n');
REQ_TIMEOUT = 300000;

/*
 * iterating cities
 */
function iterateCities(url, cities){
    for(i=0; i<cities.city.length; i++){
        url1 = url + '&location=' + cities.city[i];
        getAttr(url1, cities.city[i]);
    };
}

/*
 * getting the total number of concerts in each city
 */
function getAttr(url, city){
    var parsedRslts ='';
    var location ='';
    var total = 0;
    const MAX_TOTAL = 200;
    options = { uri: url, timeout: REQ_TIMEOUT };
    console.log('Fetching attributes for '+city+' with : '+util.inspect(options)+'\n');
    request(options, function(err, res, results){
        if(!err) {
            parsedRslts = JSON.parse(results);
            if(!parsedRslts.events){
                console.log('***error could not fetch results for '+city+'!***\n');
                console.log(results + '\n' + util.inspect(options) + '\n' + err);
            }
            else {
                total = parsedRslts.events['@attr'].total;
                location = parsedRslts.events['@attr'].location;
                console.log('location: ' + location);
                console.log("total concerts in this location to process: " + total);
                if(total <= MAX_TOTAL) getConcerts(url, total, location)
                else getConcertsUsingPages(url, location, 1, MAX_TOTAL);
            };
       } else console.log('err in getAttr(): ' + err);
    });
}

/*
 * getting concerts for each city if limit <= 1000
 */
function getConcerts(url, limit, location){
    var parsedJSON = '';
    var url = url + '&limit=' + limit;
    console.log('Sending request on: ' +url + '\n');
    options = { uri: url, timeout: REQ_TIMEOUT };
    request(options, function(err, res, results) {
        if(!err) {
            parsedJSON = JSON.parse(results);
            if (parsedJSON.events) {
                pushEvents(parsedJSON, location);
            }
        } else console.log('err in getConcerts(): ' + err);
    });
}

/*
 * getting concerts for each city if limit > 1000
 */
function getConcertsUsingPages(url, location, page, limit){
    var parsedJSON = '';
    var totalpages = 0;
    var url = url + '&limit=' + limit + '&page=' + page;
    console.log('\nPage: ' + page);
    console.log('Sending request on: ' +url + '\n');
    options = { uri: url, timeout: REQ_TIMEOUT };
    request(options, function(err, res, results){
        if(!err) {
            parsedJSON = JSON.parse(results);
            if(parsedJSON.events){
                totalpages = parsedJSON.events['@attr'].totalPages;
                totalpages = parseInt(totalpages, 10);
                page = parsedJSON.events['@attr'].page;
                page = parseInt(page, 10);
                console.log('Location: ' + location + ' Page: ' +page+ ' / '+ totalpages);
                pushEvents(parsedJSON, location);
                if(page < totalpages){
                    getConcertsUsingPages(url, location, page+1, limit);
                };
            };
        } else console.log('err in getConcertsUsingPages(): ' + err);
    });
}

/*
 * Creating JSON of the recieved concerts
 */
function pushEvents(parsedJSON, location){
    var dict = {};
    var newArray = [];
    var length = 0;
    length = (parsedJSON.events.event).length;
    console.log('processing database for : ' + location + ' - # of events : ' + length);
    // creating JSON
    for(i =0; i<length; i++){
        dict = parsedJSON.events.event[i];
        _checkInputFileds(dict, function(out, fields_ok){
            if(fields_ok) {
                desc = encoder.htmlEncode(dict.description);
                // building an array of dict of events
                var item = {
                    "_id" : dict.id,
                    title : dict.title,
                    artist : dict.artists.artist,
                    address : {name: dict.venue.name, street : dict.venue.location.street,
                                postalcode : dict.venue.location.postalcode,
                                city : dict.venue.location.city, country : dict.venue.location.country},
                    latlong : [ parseFloat(dict.venue.location['geo:point']['geo:lat']),
                               parseFloat(dict.venue.location['geo:point']['geo:long'])],
                    url : dict.url,
                    startDate : new Date(dict.startDate),
                    image : dict.image[1]["#text"],
                    description : desc
                };
                if(dict.hasOwnProperty('tags')) item.tags = dict.tags.tag;
                newArray.push(item);
            }
        });
    }
    // sending an array of events to be inserted into db
    database.insertData(newArray);
}

function startUpdate(){
    iterateCities(url, villes);
}

function _checkInputFileds(input, fn){
    _fields = ['id', 'title', 'artists', 'venue', 'startDate', 'image', 'description'];
    var fields_ok = true;
    for(var key in _fields){
        if(!input.hasOwnProperty(_fields[key])){
            console.log("key [" + key + "] = " + _fields[key] + " \ninput : " + util.inspect(input));
            fields_ok = false;
        }
    }
    return fn(input, fields_ok);
}

var database = require('./node-mongodb');
// database.dropCollection();
database.ensureIndex();
var apiKey = 'dbc287366d92998e7f5fb5ba6fb7e7f1';
var distance = "&distance=500";
var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents'+ distance +'&api_key='+apiKey+'&format=json';

exports.startUpdate = startUpdate;