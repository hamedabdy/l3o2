/*
 * this file shows a html page and using method post logs
 * the response
 */

//making http server
var http = require('http');
    fs = require('fs');
var util = require('util');
var querystring = require('querystring');

//importing parsedChunk from red-json-lastfm.js
var reqJsonLastfm = require('./req-json-lastfm');

//visual presentation of mongo dataBase
//var mongoExpress = require('mongo-express');

//opening html page
fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }
    
http.createServer(function(request, response) {  
    response.writeHeader(200, {"Content-Type": "text/html"});  
    response.write(html);
    
    var chunk = '';
            
    request.on('data', function(data){
        chunk += data;
    });
        
    request.on('end', function(){
        //console.log(chunk + ' <-post data here');       
        var p = util.inspect(querystring.parse(chunk));
        //console.log(p + ' <-parsed data here');
        response.write(p + ' <- parsed in html page');
        //response.write(' imported data: ' + parsedChunk);
        //console.log('parsedchunk: ' + parsedChunk);
        response.end();  
        });
    }).listen(8000);
});