#!/usr/bin/env node

//Visual mongoDB
//var mongoExpress = require('mongo-express');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

var data = {};

function getData(args) {
    data = args;
    openClient();
}

function insertData(err, collection) {
    collection.insert(data);
    collection.ensureIndex({latlong : "2d"});
    //client.close();
}

function openClient() {
    //getData(arg);
    //calling function insertData on collection 'test'
    client.collection("test", insertData);
    console.log('data inserted successfully!\n');
}
    
    //opening dataBase 
client.open(function(err,pClient){
    if(!err){
        openClient();
    }
    else console.log('\n ***error occured in node-mongodb.js***');
});
//openClient();
//exports.openClient = openClient;
exports.getData = getData;