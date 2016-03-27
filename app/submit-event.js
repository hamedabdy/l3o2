#!/usr/bin/env node

var mongojs     = require('mongojs')
    ,mongo      = require('./node-mongodb')
    ,util       = require('util')
    ,logger     = require('../logger').appLog
    ,util       = require('util')
    ,crypto     = require('crypto')
    ,twitter    = require('./twitter');

module.exports = function(app) {

    app.get('/se', function(req, res){
        if(Object.keys(req.query).length == 0){
            cipherArray([5, 50, 100, 150, 200, 400], function(arr){
                var msg = req.session.msg;
                req.session.msg = null;
                res.render('submit-event', {message: msg, score : arr});
            });
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
        decipherText(req.body.score, function(decrypted){
            req.body.score = parseInt(decrypted);
            mongo.insertData(req.body);
        });
        // Post status to Twitter
        status = '#' + req.body.artist[0].replace(/ /g, '') + ' • ' + req.body.title 
                    + ' • ' 
                    + 'http://concert-dacote.com/m?lat='+latlng[0]+'&lng='+latlng[1]+'&range=10&artist='
                    + req.body.artist[0].replace(/ /g, '+');
        twitter.postStatus(status);
        // res.render('submit-event', {message: 'Thank you for your submission'});
        req.session.msg = 'Thank you for your submission';
        res.redirect('/se');
    });
}


/**
 * Methods
**/

// Should eventually replace this by user cookie_id or user's hash
var key = 'salt';

function cipherArray (text_array, fn) {
    arr = [];
    for (var i = 0; i < text_array.length; i++) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        encrypted = cipher.update(String(text_array[i]), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        arr.push(encrypted);
    };
    return fn(arr);
}

function decipherText (encrypted, fn) {
    decipher = crypto.createDecipher('aes-256-cbc', key);
    decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return fn(decrypted);
}