#!/usr/bin/env node

var mongojs         = require('mongojs')
    ,configDB       = require('../config/database')
    ,db             = mongojs(configDB.url, ['concerts'])
    ,db2            = mongojs(configDB.url, ['ads'])
    ,userlocation   = require('./userlocation')
    ,util           = require('util')
    ,logger         = require('../logger').appLog;

module.exports = function(app) {

    app.get('/', function(req, res){
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.locals.url = fullUrl;
        var o = { lat : 48.8588589, lng : 2.3470599, loc : 'unknown' };
        if(Object.keys(req.query).length == 0 || (req.query.p && req.query.p >= 1) ) {
            var ip = req.headers['x-forwarded-for'];
            p = req.query.p || 1;
            logger.debug('ip = ' + ip);
            userlocation.getRemoteGeoLocationFromIp(ip, function(err, results){
                var r = "";
                const DISPLAY_TOTAL = 33;
                const RADIUS = 100;
                r = (results) ? JSON.parse(results) : '{status:' + err +'}';
                if(r.status == "success") {
                    o = {lat : r.lat, lng : r.lon, loc : r.city + ', ' + r.country, p: p};
                    getConcerts(o.lat, o.lng, RADIUS, '', DISPLAY_TOTAL, '', p, function(err, results) {
                        if (!err) {
                            countDocs(o.lat, o.lng, RADIUS, function(err, count) {
                                o.concerts = results;
                                o.totalPages = Math.ceil(count/DISPLAY_TOTAL);
                                res.render('index', o);
                            });
                        }
                    });
                } else {
                    getConcerts(o.lat, o.lng, RADIUS, '', DISPLAY_TOTAL, '', p, function(err, results) {
                        if (!err) {
                            countDocs(o.lat, o.lng, RADIUS, function(err, count) {
                                o.concerts = results;
                                o.totalPages = Math.ceil(count/DISPLAY_TOTAL);
                                res.render('index', o);
                            });
                        }
                    });
                }
            });
        } else {
                res.render('404', {});
        }
    });

    /**
     * MAP route
     * if a specifique request (address and artist name) the corresponding event's score is incremented
     * in order to stimulate the click action!
     */
    app.get('/m', function(req, res){
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.locals.url = fullUrl;
        var q = req.query;
        if(Object.keys(q).length != 0){
            res.locals.query = q;
            if (q.artist)
                db.concerts.findAndModify({ query: { artist: q.artist }, update: { $inc: { score: 1 } } }, function() {});
            q.range = parseInt(q.range.split(' ')[0]);
            getConcerts(q.lat, q.lng, q.range, q.artist, '', '', 1, function(err, results){
                if(!err) 
                    res.render('map', {lat: q.lat, lng: q.lng, concerts : results});
                else 
                    res.render('404', {});
            });
        }
        else {
            res.locals.query = null;
            res.render('map', {lat: 0, lng: 0, concerts : []});
        }
    });

    /**
     * Get event address from client's Google geolocation if unknown.
     */
    app.put('/location', function(req, res){
        db.concerts.findAndModify({ query: { '_id' : req.body['_id'] }, update: { $set: { address: req.body.address } } }, function() {});
    });

    /*
     * Concerts API
     */
    app.get('/concert', function(req, res){
        var q =  req.query;
        getConcerts(q.lat, q.lng, q.range, q.artist, q.l, q.date, q.page, function(err, results) {
            if (!err) res.send(results);
            else res.send(err);
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
function getConcerts (lat, lng, radius, artists, limit, date, page, fn) {
    var l = parseFloat(limit) || 100;
    page = page || 1;
    var newDate = date || new Date();
    var dbQuery = { latlng: { $near:[parseFloat(lat), parseFloat(lng)], $maxDistance: parseFloat(radius)/111.12} };
    if (artists) dbQuery.artist = new RegExp(artists, 'i');
    dbQuery.startDate = { $gte : new Date(newDate)};
    db.concerts.find(dbQuery).sort({'score' : -1}).skip(--page*l).limit(l, function(err, result) {
        if(!err) {
            logger.info('# of concerts returned = ' + result.length + '\n');
            return fn(null, result);
        } else {
            logger.error(err);
            return fn(err, null);
        }
    });
}

function countDocs (lat, lng, radius, fn) {
    var dbQuery = { latlng: { $near:[parseFloat(lat), parseFloat(lng)], $maxDistance: parseFloat(radius)/111.12} };
    var newDate = new Date();
    dbQuery.startDate = { $gte : new Date(newDate)};
    db.concerts.count(dbQuery, function(err, results) {
        if (!err) return fn(null, results);
        else return fn(err, null);
    });
}