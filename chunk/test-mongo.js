var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('test', new Server('127.0.0.1', 27017), {safe:false});

var data = '';

function getData(args) {
    data = args;
}

exports.getData = getData;

//function to insert data into default collection
function insertData(err, collection){
    //collection.insert({name: 'something'});
    collection.insert(data);
    client.close();
}

//function to list all data in default collection
var listAllData = function(err, collection){
    collection.find().toArray(function(err, results){
        console.log(results);
        client.close();
    });
}

function nodeMongo(arg) {
    getData(arg)
    //opening dataBase
client.open(function(err,pClient){
        console.log('data: ' + data);
        //calling function insertData on collection 'test'
        client.collection('test', insertData);
        console.log('data inserted correctly!');
        //calling fucntion listAllData on collection 'test'
        //client.collection('test', listAllData);
});
}

exports.nodeMongo = nodeMongo;