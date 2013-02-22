#!/usr/bin/env node

var request = require('request');

var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=madrid&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url, function(err, res, results) {
    if(!err)
    console.log(results);
    else 
    console.log('error occured');
<<<<<<< HEAD
});
=======
});
>>>>>>> 031676c01ec5b08e119f126070ff376aae00424b
