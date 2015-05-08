#!/usr/bin/env node

var mongojs 	= require('mongojs'),
    configDB 	= require('../config/database');,
	db 			= mongojs(configDB.url, ['concerts']);

/*
 * inserting data into database
 */
function insertData(data) {
    db.concerts.insert(data, {continueOnError: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log('data inserted successfully!\n');
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