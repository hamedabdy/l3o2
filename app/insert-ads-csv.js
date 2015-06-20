#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var parse = require('csv-parse');
var async = require('async');
var database = require('./node-mongodb');

exports.insertCsvAds = function() {
    var dir='./config/ads/';
    var data={};
    fs.readdir(dir,function(err,files){
        if (err) throw err;
        var c=0;
        files.forEach(function(file){
            c++;
            fs.readFile(dir+file,'utf-8',function(err,csv){
                if (err) throw err;
                data[file]=csv;
                if (0===--c) {
                    var array = [];
                    parse(data[file], {}, function(err, output) {
                        if(err) throw err;
                        async.forEach(output, function(row, callback){
                            var i = 0, item = {};
                            async.forEach(row, function(col, callback){
                                key = output[0][i++].toLowerCase().replace(/link id/, "_id");
                                item[key] = col;
                                // indicate the end of loop - exit out of loop
                                callback();
                            }, function(err){
                                if(err) throw err;
                            });
                            array.push(item);
                            // indicate the end of loop - exit out of loop
                            callback();
                        }, function(err){
                            if(err) throw err;
                        });
                        array.splice(0, 1);
                        database.insertAds(array);
                    });
                }
            });
        });
    });
};