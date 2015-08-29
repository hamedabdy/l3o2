#!/usr/bin/env node

var mongojs       	= require('mongojs')
	,configDB 		= require('../config/database')
	,db 			= mongojs(configDB.url, ['concerts'])
	,db2 			= mongojs(configDB.url, ['ads'])
	,userlocation 	= require('./userlocation')
	,util 			= require('util')
	,logger			= require('../logger').appLog;

module.exports = function(app) {

	app.get('/', function(req, res){
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		res.locals.url = fullUrl;
		var o = { lat : 48.8588589, lng : 2.3470599 };
		if(Object.keys(req.query).length == 0) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			logger.debug('ip = ' + ip);
			userlocation.getRemoteGeoLocationFromIp(ip, function(err, results){
				logger.debug(err + " " + results);
				if (err) {
					logger.error(err);
				} else if(results.ip) {
					var r = JSON.parse(results);
                    o = {lat : r.latitude, lng : r.longitude};
				}
			});
			getConcerts(o.lat, o.lng, 100, '', 50, '', function(err, results) {
			if (!err) {
				o.concerts = results;
				res.render('index', o);
			}
			});
		} else {
			if (req.query.lat && req.query.lng)
				o = {lat : req.query.lat, lng : req.query.lng};
			else
				res.render('404', {});
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
					results[0].score = parseInt(results[0].score)+1;
					db.concerts.update({'_id': results[0]['_id']}, results[0]);
					res.render('map', {concerts : results});
				} else res.render('404', {});
			});
		}
		else {
			res.locals.query = null;
			res.render('map', {concerts : []});
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
 	var dbQuery = { latlng: { $near:[parseFloat(lat), parseFloat(lng)], $maxDistance: parseFloat(radius)/111.12} };
 	if (artists) dbQuery.artist = new RegExp(artists, 'i');
 	var newDate = new Date();
 	if (date) newDate = date;
 	dbQuery.startDate = { $gte : new Date(newDate)};
 	db.concerts.find( dbQuery).sort({'score' : -1}).limit(l, function(err, result) {
	   	if(!err) {
    		logger.info('\n# of concerts returned = ' + result.length + '\n');
	        return fn(null, result);
	    } else {
	    	logger.error(err);
	    	return fn(err, null);
	    }
	});
}