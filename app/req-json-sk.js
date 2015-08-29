#!/usr/bin/env node

var request = require('request');
var pays = require('../config/pays');
var util = require('util');
var async = require('async');
var database = require('./node-mongodb');

// database.dropCollection();
database.ensureIndex();

REQ_TIMEOUT = 300000;
// Max events per page allowed by SK API = 100
MAX_PER_PAGE = 100;
var apiKey = 'apikey=iHuSRRJBhfdVPdJL';
var per_page = '&per_page='+MAX_PER_PAGE;
var api_loc = 'http://api.songkick.com/api/3.0/search/locations.json?'+apiKey+per_page;
var api_eve = 'http://api.songkick.com/api/3.0/events.json?'+apiKey+'&page=%s'+per_page;
var img_cdn = 'http://images.sk-static.com/images/media/profile_images/artists/%s/card_avatar';
var api_geo = 'http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&lat=%s&lon=%s';
// var api_geo = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=%s&lon=%s';

console.log('\n*** Total number of locations to process : ' + pays.country.length + ' ***\n');
console.log('*** Please be patient while sending requests this may take a while... ****\n');

/*
 * iterating cities
 */
function iterateCityFile(url, pays){
    for(i=0; i<pays.country.length; i++){
        var _url = url + '&query=' + pays.country[i];
        getCityId(_url, pays.country[i]);
    };
}

function getCityId (url, country) {
    options = { uri: url, timeout: REQ_TIMEOUT};
    console.log('Fetching attributes for '+country+' with : '+options+'\n');
    request(options, function(err, res, results){
        if(!err) {
            var r = JSON.parse(results).resultsPage;
            if(r.status=='ok'){
                (r.results.location).forEach(function(item){
                    var city = item.city.displayName;
                    _url = api_eve + '&location=sk:'+ item.metroArea.id;
                    getEventAttr(_url, city);
                });
            }
        }
    });
}

function getEventAttr (url, city_name) {
    // Replace page number placeholder in url
    options = { uri: util.format(url, '1'), timeout: REQ_TIMEOUT};
    request(options, function(err, res, results){
        if(!err){
            var r = (JSON.parse(results)).resultsPage;
            console.log('Fetching attributes for '+city_name+' with : '+options + ' -- totalEntries= '+r.totalEntries);
            // (r.totalEntries/MAX_PER_PAGE)+1 = total pages
            var totalPages = parseInt(r.totalEntries/MAX_PER_PAGE)+1;
            for(p=1; p<totalPages; p++){
                _url = util.format(url, p);
                getEventPerCityId(_url, city_name);
            }
        }
    });
}

function getEventPerCityId (url, city_name) {
    options = { uri: url, timeout: REQ_TIMEOUT};
    // console.log('Fetching events for : ' + city_name + ' with : ' + options+'\n');
    request(options, function(err, res, results){
        if(!err){
            var r = JSON.parse(results).resultsPage;
            if(r.status=='ok'){
                async.map(r.results.event, function eachItem (item, callback){
                    var artist = [];
                    (item.performance).forEach(function(a){
                        artist.push(a.displayName);
                    });
                    reverseGeocode(item.location.lat, item.location.lng, function(err, result){
                        if(!err){
                            var eve = {
                                        '_id' : 'sk_'+item.id,
                                        'title' : item.displayName,
                                        'artist' : artist,
                                        'latlng' : [parseFloat(item.location.lat), parseFloat(item.location.lng)],
                                        'address' : result,
                                        'startDate' : ((!item.start.datetime) ?  new Date(item.start.date) : new Date(item.start.datetime)),
                                        'url' : item.uri,
                                        'img' : ((item.performance[0]) ? util.format(img_cdn, item.performance[0].artist.id) : null),
                                        'score' : 0,
                                        'source' : 'songkick'
                                    };
                            callback(null, eve);
                        }
                    });
                }, function done (err, result){
                    console.log('Inserting events for -- ' + city_name + '--');
                    database.insertData(result);
                });
            }
        }
    });
}


function reverseGeocode (lat, lng, callback) {
    url = util.format(api_geo, lat, lng);
    request({uri: url}, function(err, res, result){
        if(!err){
            var r = null;
            try{
                r = JSON.parse(result);
                return callback(null, r.house_number+', '+r.road+' '+r.postcode+', '+r.city+' '+r.country);
            }
            catch (e) {
                return callback(e, null);
            }
        } else return callback(err, null);
    });
}

function startUpdate(){
    iterateCityFile(api_loc, pays);
}

exports.startUpdate = startUpdate;