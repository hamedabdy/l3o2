#!/usr/bin/env node

var mongojs 	= require('mongojs')
    ,configDB 	= require('../config/database')
    ,db			= mongojs(configDB.url, ['concerts'])
    ,db2        = mongojs(configDB.url, ['ads'])
    ,logger     = require('../logger').appLog;

/*
 * inserting data into database (Insert everythin and clean the old ones afterwards)
 */
function insertData(data) {
    db.concerts.insert(data, {continueOnError: true}, function(err, docs){
       if(err) logger.error('err: ' + err + '\n');
       else logger.info('concerts inserted successfully!\n');
   });
};

/*
 * upsert data into database (Accepts only one doc at a time)
 */
function upsertData(data) {
    db.concerts.update(data, data, {continueOnError: true, upsert: true}, function(err, docs){
       if(err) logger.error('err: ' + err + '\n');
       else logger.info('concerts upserted successfully!\n');
   });
};

function dropCollection(){
	db.concerts.drop();
};

function ensureIndex(){
	db.concerts.ensureIndex({latlng : "2d"});
};

function closeDatabase(){
	db.close();
	logger.info('concerts db cloesd!');
};

function insertAds(data) {
    db2.ads.insert(data, {continueOnError: true}, function(err, docs){
       if(err) logger.error('err: ' + err + '\n');
       else logger.info('ads inserted successfully!\n');
       db2.close();
   });
};

function closeAdsDb(){
    db2.close();
    logger.info('ads db cloesd!');
};

exports.dropCollection = dropCollection;
exports.insertData = insertData;
exports.upsertData = upsertData;
exports.ensureIndex = ensureIndex;
exports.closeDatabase = closeDatabase;
exports.insertAds = insertAds;
exports.closeAdsDb = closeAdsDb;