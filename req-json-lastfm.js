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
    var location ='';
    var total = 0;
    const MAX_TOTAL = 800;
    request(url, function(err, res, results){
        parsedRslts = JSON.parse(results);
        if(!parsedRslts.events){
            console.log('***error could not fetch results for '+city+'!***\n');
            console.log(results);
        }
        else {
            total = parsedRslts.events['@attr'].total;
            location = parsedRslts.events['@attr'].location;
            console.log('location: ' + location);
            console.log("total concerts in this location to process: " + total);
            if(total <= MAX_TOTAL) getConcerts(url, total, location)
            else getConcertsUsingPages(url, location, 1, MAX_TOTAL);
        };
       if(err) console.log('err in getAttr: ' + err);
    });
}

/*
 * getting concerts for each city if limit <= 1000
 */
function getConcerts(url, limit, location){
    var parsedJSON = '';
    var url2 = url + '&limit=' + limit;
    console.log('Sending request on: ' +url2 + '\n');
    request(url2, function(err, res, results) {
        parsedJSON = JSON.parse(results);
        if (parsedJSON.events) {
            pushEvents(parsedJSON, location);
        }
        if(err) console.log('err in getConcerts: ' + err);
    });
}

/*
 * getting concerts for each city if limit > 1000
 */
function getConcertsUsingPages(url, location, page, limit){
    var parsedJSON = '';
    var totalpages = 0;
    var url2 = url + '&limit=' + limit + '&page=' + page;
    console.log('\nPage: ' + page);
    console.log('Sending request on: ' +url2 + '\n');
    request(url2, function(err, res, results){
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
            }
        }
        if(err) console.log('err in getConcertsUsingPages: ' + err);
    });
}

/*
 * Creating JSON of the recieved concerts
 */
function pushEvents(parsedJSON, location){
    var myobject = '';
    var obj = [];
    var length =0;
    length = (parsedJSON.events.event).length;
    console.log('processing database for: ' + location);
    //creating JSON
    for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];
        //adding data to JSON
        obj.push({
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
    /*
     * inserting each concert into database
     */
    database.insertData(obj);
}

function startUpdate(){
    iterateCities(url, villes);
}

var database = require('./node-mongodb');
database.dropCollection();
database.ensureIndex();
var apiKey = 'dbc287366d92998e7f5fb5ba6fb7e7f1';
var distance = "&distance=500";
var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents'+ distance +'&api_key='+apiKey+'&format=json';
//iterateCities(url, villes);
exports.startUpdate = startUpdate;
