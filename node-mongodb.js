#!/usr/bin/env node

var mongojs = require('mongojs'),
    dburl = process.env.MONGOHQ_URL || 'mongodb://localhost/test',
	db = mongojs(dburl, ['concerts']);

/*
 * inserting data into database
 */
function insertData(data) {
    db.concerts.insert(data, {keepGoing: true, safe: true}, function(err, docs){
    	console.log('err: ' + err + '  docs:' + docs);
    	if(!err) console.log('data inserted successfully!\n');
    });
}

function dropCollection(){
	db.concerts.drop();
}

function ensureIndex(){
	db.concerts.ensureIndex({latlong : "2d"});
}

function closeDatabase(){
	db.close();
	console.log('db cloesd!');
}

exports.dropCollection = dropCollection;
exports.insertData = insertData;
exports.ensureIndex = ensureIndex;
exports.closeDatabase = closeDatabase;