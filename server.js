/*
 * this file shows a html page and using method post logs
 * the response
 */


var http = require('http'),
    fs = require('fs');
var util = require('util');
var querystring = require('querystring');

fs.readFile('./newpage.html', function (err, html) {
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
            console.log(chunk + ' <-post data here');       
            var p = util.inspect(querystring.parse(chunk));
            response.end(p + ' <- write in html page');
            console.log(p + ' <-parsed data here');
            response.write(p + ' <- parsed in html page');
            });
        //response.end(' <- write in html page');  
    }).listen(8000);
});