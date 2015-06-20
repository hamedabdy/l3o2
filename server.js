#!/usr/bin/env node

var fs            = require('fs')
  , https         = require('https')
  , http          = require('http')
  , express       = require('express')
  , app           = express()
  , key           = fs.readFileSync('./cert/concertdacote-key.pem')
  , cert          = fs.readFileSync('./cert/concertdacote-cert.pem')
  , cookieParser  = require('cookie-parser')
  , bodyParser    = require('body-parser')
  , session       = require('express-session')
  , compression   = require('compression')
  , favicon       = require('serve-favicon')
  , morgan        = require('morgan')
  , flash         = require('connect-flash')
  , passport      = require('passport')
  , https_options = { key: key, cert: cert }
  ;

// Express 4.x config
//var env = process.env.NODE_ENV || 'development';
//if ('development' == env) {

   // configure stuff here
  app.disable('x-powered-by');
  // only log error responses
  app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
  }));
  app.use(favicon(__dirname + '/public/images/favicon.ico'));
  app.set('views', __dirname + '/public/views/');
  app.set('view engine', 'ejs');
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(session({
    secret: 'concert_dacote',
    resave: false,
    saveUninitialized: true
  }));
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(compression({ threshold: 512 }));
  app.use(express.static(__dirname+'/public/'));
//}

var user_auth     = require('./app/user-auth')(app, passport)
  , routes        = require('./app/routes')(app);

app.use(function(req, res, next) {
    res.status(404);
    res.render('404', {});
  });
app.listen(process.env.PORT || 3000);
https.createServer(https_options, app).listen(process.env.PORT+443 || 3443);
console.log('server listening on port 3000 (HTTP) || 3443 (HTTPS) || ' + process.env.PORT);