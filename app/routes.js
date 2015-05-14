#!/usr/bin/env node

var mongojs       = require('mongojs');
var configDB 	= require('../config/database');
var db 			= mongojs(configDB.url, ['concerts']);
var userlocation  = require('./userlocation');
var util = require('util');

module.exports = function(app) {

	app.get('/', function(req, res){
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		res.locals.url = fullUrl;
		if(Object.keys(req.query).length == 0 ) {
			var ip = req.headers['x-forwarded-for']
				|| req.connection.remoteAddress
				|| req.socket.remoteAddress
				|| req.connection.socket.remoteAddress;
			var ip_latitude   = 48.8588589
				, ip_longitude  = 2.3470599;
			// ip = '46.193.143.95';
			console.log('\n\n[DEBUG] ip = ' + ip);
			userlocation.getRemoteGeoLocationFromIp(ip, function(err, results){
				var r = '';
				if (err) {
					console.log('err = ' + err);
					getConcerts(ip_latitude, ip_longitude, 50, '', '', '', function(err, results) {
						if (!err) {
							p = {lat : ip_latitude, lng : ip_longitude, concerts : results};
							res.render('index', p);
						}
					});
				} else if(results.ip) {
					r = JSON.parse(results);
					getConcerts(r.latitude, r.longitude, 100, '', '', '', function(err, results) {
						if (!err) {
							p = {lat : r.latitude, lng : r.longitude, concerts : results};
							res.render('index', p);
						}
					});
				}
			});
		} else {
			if (req.query.lat && req.query.lng)
				p = {lat : req.query.lat, lng : req.query.lng};
			else 
				p = {lat : ip_latitude, lng : ip_longitude};
			getConcerts(p.lat, p.lng, 50, '', '', '', function(err, results) {
				if (!err) {
					p = {lat : p.lat, lng : p.lng, concerts : results};
					res.render('index', p);
				}
			});
		}
	});

	app.get('/m', function(req, res){
		if(Object.keys(req.query).length != 0){
			res.locals.query = req.query;
			var lat = req.query.lat
				, lng = req.query.lng
				, artist = req.query.artist;
			getConcerts(lat, lng, 10, artist, '', '', function(err, results){
				if(!err){
					res.render('map', {concerts : results});
				}
			});
		}
		else {
			res.locals.query = null;
			res.render('map', {concerts : null});
		}
	});

	/*
	 * Getting data from database filtered by artist and client's date
	 */
	app.get('/concert', function(req, res){
		var q =  req.query;
		getConcerts(q.lat, q.long, q.range, q.artist, q.l, q.date, function(err, results) {
			if (!err) {
				res.send(results);
			}
		});
	});

}


/**
 * METHODS
 */

/**
 * Method to return concerts from server using given params
 * @param lat : latitude of db search
 * @param lng : longitude of db search
 * @param radius : radius of db search
 * @param artists : filter db results with artists
 * @param limit : max number of returned results from db
 * @param date : used to fetch concerts later than date
 * @param fn : callback function (err, results)
 */
function getConcerts (lat, lng, radius, artists, limit, date, fn) {
 	var l = 5000;
 	if (limit) l = limit;
 	var dbQuery = { latlong: { $near:[parseFloat(lat), parseFloat(lng)], $maxDistance: parseFloat(radius)/111.12} };
 	if (artists) dbQuery.artist = new RegExp(artists, 'i');
 	var newDate = new Date();
 	if (date) newDate = date;
 	dbQuery.startDate = { $gte : new Date(newDate)};
 	db.concerts.find( dbQuery, { 'limit' : l }, function(err, result) {
	   	if(!err) {
    		console.log('# of concerts returned = ' + result.length);
	        return fn(null, result);
	    } else {
	    	console.log(err);
	    	return fn(err, null);
	    } 
	});
}