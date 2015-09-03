#!/usr/bin/env node

var mongojs     = require('mongojs')
    ,configDB   = require('../config/database')
    ,db         = mongojs(configDB.url, ['concerts'])
    ,util       = require('util')
    ,logger     = require('../logger').appLog;

module.exports = function(app) {

    app.get('/se', function(req, res){
        if(Object.keys(req.query).length == 0){
            res.render('submit-event', {message: ''});
        } else {
            res.render('404', {});
        }
    });

    app.post('/se', function(req, res){
        req.body.startDate = new Date(req.body.startDate);
        var latlng = req.body.latlng.split(',');
        req.body.latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
        req.body.source = 'form';
        req.body.artist = req.body.artist.split(', ');
        req.body.tags = req.body.tags.split(', ');
        req.body.score = parseInt(req.body.score);
        db.concerts.insert(req.body);
        res.render('submit-event', {message: 'Thank you for your submission'});
    });
}