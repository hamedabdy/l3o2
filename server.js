
var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	url = process.env.MONGOHQ_URL || 'mongodb://localhost/test',
	db = mongojs(url, ['test']);

app.use(express.static(__dirname+'/'));
console.log('Starting server...');
console.log('server listening on port 3000');

app.get('/concert', function(req, res){
	console.log(req);
	db.test.find({ latlong : {$near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
		$maxDistance: parseFloat(req.query.rayon)/111.12}}, {},
		{ limit : 5000 },
		function(err, concert) {
			//console.log(concert.length);
			console.log(err);
		res.send(concert); 
	});
});

//Partie Mettant a jour la base de données et en inserant les datas

app.get('/maj', function(req, res){
	var requestLastfm = require('./req-json-lastfm');
	res.send("mise a jour de la base a était lancé avec succes");
	});
app.listen(process.env.PORT || 3000);