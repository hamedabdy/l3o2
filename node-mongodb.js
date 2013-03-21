#!/usr/bin/env node

//importing JSON from req-json-lastfm.js
//var reqJsonLastfm = require('./req-json-lastfm');
//storing JSON from req-json-lastfm.js
//var jsonStringify = reqJsonLastfm.jsonStringify;

//importing concert.json file
//var concert = require('./concerts/');
//var dir = requireDir('./concerts');
//var directory = require('./concerts');
//var util = require('util');
var mongoExpress = require('mongo-express');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

//function to insert data into default collection
var insertData = function(err, collection){
    //collection.insert({name: 'something'});
    //collection.insert(concert);
    require("fs").readdirSync("./concerts").forEach(function(file, i) {
            var test = [];
            test[i] = require("./concerts/" + file);
            //console.log('index.js:' + util.inspect(test[i]));
            collection.insert(test[i]);
        });
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
        console.log('concert: ');
        //calling function insertData on collection 'test'
        client.collection("test", insertData);
        console.log('fin de insert ');
        //calling fucntion listAllDta on collection 'test'
        client.collection('test', listAllData);
    }
    else console.log('\n ***error occured in node-mongodb.js***');
});
