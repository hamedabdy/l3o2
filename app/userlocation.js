#!/usr/bin/env node

var request = require('request');
var util = require('util');

function getRemoteGeoLocationFromIp (ip, fn) {
	var url = 'https://freegeoip.net/json/'+ip;
	console.log('Requesting : ' + url);
	request({'uri' : url, 'timeout' : 2000}, function(err, response, results){
		console.log(err, results);
		return fn(err, results);
	});
}

exports.getRemoteGeoLocationFromIp=getRemoteGeoLocationFromIp;