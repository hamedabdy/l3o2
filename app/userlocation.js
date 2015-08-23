#!/usr/bin/env node

var request     = require('request')
    ,util       = require('util')
    ,logger     = require('../logger').appLog;

function getRemoteGeoLocationFromIp (ip, fn) {
	var url = 'https://freegeoip.net/json/'+ip;
	logger.debug('Requesting : ' + url);
	request({'uri' : url, 'timeout' : 1000}, function(err, response, results){
		logger.debug(err, results);
		return fn(err, results);
	});
}

exports.getRemoteGeoLocationFromIp=getRemoteGeoLocationFromIp;