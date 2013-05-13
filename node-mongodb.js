#!/usr/bin/env node

var mongojs = require('mongojs'),
    url = process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote',
	db = mongojs(url, ['concerts']);

/*
 * inserting data into database
 */
function getData(data) {
    db.concerts.insert(data);
    db.concerts.ensureIndex({latlong : "2d"});
    console.log('data inserted successfully!\n');
}

function removeData(){
	db.concerts.remove();
}
exports.removeData = removeData;
exports.getData = getData;