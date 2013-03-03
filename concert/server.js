var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	db = mongojs('mongodb://localhost/descartes', ['concerts']);

app.use(express.static(__dirname+'/'));

app.get('/concert', function(req, res){
	db.concerts.find({}, function(err, concert) {
		res.send(concert);
	});
});

app.listen(3000);