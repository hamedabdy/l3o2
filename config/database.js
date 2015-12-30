#!/usr/bin/env node


var prot = 'mongodb://';
var db_user = 'concertdacote';
var db_pass = 'Concertdacote789';
var mongoLab_url = '@ds037155.mongolab.com:37155/concertdacote';
var local_url = 'localhost/concertdacote';
mongoLab_url = prot + db_user + ':' + db_pass + mongoLab_url;

module.exports = {
	'url' : process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || mongoLab_url
};