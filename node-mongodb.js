#!/usr/bin/env node

//Visual mongoDB
//var mongoExpress = require('mongo-express');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

var data ='';

function getData(args) {
    data = args;
}

function insertData(err, collection) {
    collection.insert(data);
    client.close();
}

function openClient(arg) {
    getData(arg);
    //opening dataBase 
client.open(function(err,pClient){
    if(!err){
        //calling function insertData on collection 'test'
        client.collection("test", insertData);
        console.log('data inserted successfully!');

    }
    else console.log('\n ***error occured in node-mongodb.js***');
});
}

exports.openClient = openClient;