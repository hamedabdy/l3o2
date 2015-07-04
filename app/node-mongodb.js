#!/usr/bin/env node

var mongojs 	= require('mongojs'),
    configDB 	= require('../config/database'),
	db 			= mongojs(configDB.url, ['concerts']),
    db2         = mongojs(configDB.url, ['ads']);

/*
 * inserting data into database
 */
function insertData(data) {
    db.concerts.insert(data, {continueOnError: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log('concerts inserted successfully!\n');
   });
};

/*
 * upsert data into database
 */
function upsertData(data) {
    db.concerts.update(data, data, {continueOnError: true, upsert: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log('concerts upserted successfully!\n');
   });
};

function dropCollection(){
	db.concerts.drop();
};

function ensureIndex(){
	db.concerts.ensureIndex({latlong : "2d"});
};

function closeDatabase(){
	db.close();
	console.log('concerts db cloesd!');
};

function insertAds(data) {
    db2.ads.insert(data, {continueOnError: true}, function(err, docs){
       if(err) console.log('err: ' + err + '\n');
       else console.log('ads inserted successfully!\n');
       db2.close();
   });
};

function closeAdsDb(){

    console.log('ads db cloesd!');
};

exports.dropCollection = dropCollection;
exports.insertData = insertData;
exports.upsertData = upsertData;
exports.ensureIndex = ensureIndex;
exports.closeDatabase = closeDatabase;
exports.insertAds = insertAds;
exports.closeAdsDb = closeAdsDb;