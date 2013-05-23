#!/usr/bin/env node

var mongojs = require('mongojs'),
    url = process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote',
	db = mongojs(url, ['concerts']);

/*
 * inserting data into database
 */
function insertData(data) {
    db.concerts.insert(data);
    console.log('data inserted successfully!\n');
}

function removeData(){
	db.concerts.remove();
}

function ensureIndex(){
	db.concerts.ensureIndex({latlong : "2d"});
}

exports.removeData = removeData;
exports.insertData = insertData;
exports.ensureIndex = ensureIndex;