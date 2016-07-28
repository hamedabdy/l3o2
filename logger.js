var log4js  = require("log4js")
    ,morgan = require("morgan");

var appLog = log4js.getLogger();
var httpLog = morgan( 'combined', {
  skip: function (req, res) { return res.statusCode < 400 },
  "stream": {
    write: function(str) { appLog.debug(str); }
  }
});

exports.appLog = appLog;
exports.httpLog = httpLog;