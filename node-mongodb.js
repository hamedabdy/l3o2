#!/usr/bin/env node

//importing JSON from req-json-lastfm.js
var reqJsonLastfm = require('./req-json-lastfm');
//storing JSON from req-json-lastfm.js
var jsonExp = reqJsonLastfm.jsonExp;
var jsonObj = reqJsonLastfm.jsonObj;

var concert = require('./concert');

var fs = require('fs');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

var insertData = function(err, collection){
    collection.insert({name: 'something'});
    collection.insert({'jsonObj' : jsonObj});
};

var listAllData = function(err, collection){
    collection.find().toArray(function(err, results){
        console.log(results);
        client.close();
    });
};

client.open(function(err,pClient){
    if(!err){
        //console.log('jsonObj: ' + jsonObj);
        console.log('json: ' + jsonExp);
        console.log('concert: ' + concert);
        client.collection("test", insertData);
        client.collection('test', listAllData);    
    }
    else console.log('error occured in node-mongodb.js');
});
