#!/usr/bin/env node

var mongojs = require('mongojs'),
    url = process.env.MONGOHQ_URL || 'mongodb://localhost/test',
	db = mongojs(url, ['test']);

var data = {};

/*
 * inserting data into database
 */
function getData(args) {
    data = args;
    db.test.insert(data);
    collection.ensureIndex({latlong : "2d"});
    console.log('data inserted successfully!\n');
}

exports.getData = getData;