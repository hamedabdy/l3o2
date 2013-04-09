
var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	db = mongojs('mongodb://localhost/test', ['test']);

app.use(express.favicon(__dirname + 'images/favicon.ico'));
app.use(express.static(__dirname+'/'));
console.log('Starting server...');
console.log('server listening on port 3000');

app.post('/concert', function(req, res){
	db.test.find({ latlong : {$near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
		$maxDistance: parseFloat(req.query.rayon)/111.12}}, {},
		{ limit : 5000 },
		function(err, concert) {
			console.log(concert.length);
		res.send(concert); 
	});
});

//Partie Mettant a jour la base de données et en inserant les datas

app.get('/maj', function(req, res){
	var requestLastfm = require('./req-json-lastfm');
	res.send("mise a jour de la base a était lancé avec succes");
	});
app.listen(process.env.VCAP_APP_PORT || 3000);