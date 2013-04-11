#!/usr/bin/env node

var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	url = process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote',
	db = mongojs(url, ['concerts']);

app.use(express.static(__dirname+'/'));
console.log('Starting server...');
console.log('server listening on port 3000 || ' + process.env.PORT);

/*
 * getting data from database
 */
app.get('/concert', function(req, res){
	db.concerts.find({ latlong : {$near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
	$maxDistance: parseFloat(req.query.rayon)/111.12}}, {},
	{ limit : 5000 },
	function(err, res) {
		console.log(res.length);
		if(err) console.log(err);
		res.send(res); 
	});
});

//Partie Mettant a jour la base de données et en inserant les datas
app.get('/maj', function(req, res){
	var requestLastfm = require('./req-json-lastfm');
	res.send("<p>mise a jour de la base a était lancé avec succes</p>");
	});
app.listen(process.env.PORT || 3000);