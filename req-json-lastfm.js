#!/usr/bin/env node

var request = require('request');
var villes = require('./liste-villes');
console.log('\n*** Total number of locations to process= ' + villes.city.length + ' ***\n');
console.log('*** Please be patient while sending requests this may take a while... ****\n');

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
    var total = 0;
    var location ='';
    request(url, function(err, res, results){
        //parsedRslts = JSON.parse(results);
        if(!results.events){
            console.log('***error could not fetch results for '+city+'!***\n');
            console.log(results);
        }
        else {
            total = results.events['@attr'].total;
            location = results.events['@attr'].location;
            console.log('location: ' + location);
            console.log("total concerts in this location to process: " + total);
            getConcerts(url, total, location);
        };
    });
}

/*
 * Creating JSON of the recieved concerts
 */
function pushEvents(parsedJSON, location, total){
    var myobject = '';
    event = [];
    var legnth =0;
        length = (parsedJSON.events.event).length;
    //creating JSON
    for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];
    //adding data to JSON
    event.push({
        "_id" : myobject.id,
        title : myobject.title,
        artist : myobject.artists.artist,
        address : {name: myobject.venue.name, street : myobject.venue.location.street,
                    postalcode : myobject.venue.location.postalcode,
                    city : myobject.venue.location.city, country : myobject.venue.location.country},
        latlong : [ parseFloat(myobject.venue.location['geo:point']['geo:lat']),
                   parseFloat(myobject.venue.location['geo:point']['geo:long'])],
        url : myobject.url,
        startDate : myobject.startDate,
        image : myobject.image[1]["#text"]
        });
    };
    callMongo(event, location);
}

/*
 * getting concerts for each city
 */
function getConcerts(url, limit, location){
    var parsedJSON = '';
    var url2 = url + '&limit=' + limit;
    console.log('url: ' +url2 + '\n');
    request(url2, function(err, res, results) {
        parsedJSON = JSON.parse(results);
        if (parsedJSON.events) {
            pushEvents(parsedJSON, location, limit);
        }
    });
}

/*
 * inserting each concert into database
 */
function callMongo(data, location) {
    console.log('processing database for: ' + location);
    nodeGo.insertData(data);
    //nodeGo.ensureIndex();
}

var nodeGo = require('./node-mongodb');
nodeGo.dropCollection();
var apiKey = 'dbc287366d92998e7f5fb5ba6fb7e7f1';
var distance = "&distance=500";
var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key='+apiKey+'&format=json' + distance;
iterateCities(url, villes);