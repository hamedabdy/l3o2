
var request = require('request');

//here goes an JSON file that contains names of cities that program would fetch info for

//here goes a for loop to gather info for every city in CITIESJSON


var url1 = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=paris&limit=100&page=&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url1, function(err, res, results){
    var parsedRslts ='';
    var totalPages = 0;
    var perPage = 0;
    var page = 0;
    var url = '';
    if(!err){
        //console.log(results);
        parsedRslts = JSON.parse(results);
        totalPages = parsedRslts.events['@attr'].totalPages;
        perPage = parsedRslts.events['@attr'].perPage;
        page = parsedRslts.events['@attr'].page;
        console.log("total pages to process: " + totalPages);
        console.log("number of results per page: " + perPage);
    }
    else console.log('*** Error in request initiation! ***');
    
    exports.totalPages = totalPages;
    
});