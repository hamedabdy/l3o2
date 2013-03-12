#!/usr/bin/env node

//importing JSON from req-json-lastfm.js
var reqJsonLastfm = require('./req-json-lastfm');
//storing JSON from req-json-lastfm.js
var jsonStringify = reqJsonLastfm.jsonStringify;

//importing concert.json file
var concert = require('./concert');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

//function to insert data into default collection
var insertData = function(err, collection){
    //collection.insert({name: 'something'});
    collection.insert({'concert' : concert});
};

//function to list all data in default collection
var listAllData = function(err, collection){
    collection.find().toArray(function(err, results){
        console.log(results);
        client.close();
    });
};

//opening dataBase 
client.open(function(err,pClient){
    if(!err){
        //console.log('jsonObj: ' + jsonObj);
        //console.log('jsonExp: ' + jsonExp);
        //console.log('concert: ' + concert);
        //calling function insertData on collection 'test'
        client.collection("test", insertData);
        //calling fucntion listAllDta on collection 'test'
        client.collection('test', listAllData);
    }
    else console.log('\n ***error occured in node-mongodb.js***');
});
