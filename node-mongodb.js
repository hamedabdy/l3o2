#!/usr/bin/env node

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//importing parsedChunk from red-json-lastfm.js
var mymodule = require('./req-json-lastfm');

var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

var insertData = function(err, collection){
    collection.insert({name: 'hamed abdy'});
};

var listAllData = function(err, collection){
    collection.find().toArray(function(err, results){
        console.log(results);
        client.close();
    });
};

client.open(function(err,pClient){
    client.collection("test", insertData);
    client.collection('test', listAllData);
});
