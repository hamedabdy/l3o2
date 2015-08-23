#!/usr/bin/env node

var mongojs     = require('mongojs')
    ,configDB   = require('../config/database')
    ,db         = mongojs(configDB.url, ['concerts'])
    ,util       = require('util')
    ,logger     = require('../logger').appLog;

module.exports = function(app) {

    app.get('/se', function(req, res){
        res.render('submit-event', {message: ''});
    });

    app.post('/se', function(req, res){
        req.body.startDate = new Date(req.body.startDate);
        req.body.latlong = [parseFloat(req.body.latlong.split(',')[0]), parseFloat(req.body.latlong.split(',')[1])];
        // req.body.artist = [req.body.artist.split(', ')[0], req.body.artist.split(',')[1]];
        // req.body.tags = [req.body.tags.split(', ')[0], req.body.tags.split(',')[1]];
        db.concerts.insert(req.body);
        res.render('submit-event', {message: 'Thank you for your submission'});
    });
}