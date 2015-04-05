#!/usr/bin/env node

var fs = require('fs')
    , https = require('https')
    , http = require('http')
    , express = require('express')
    , app = express()
    , key = fs.readFileSync('./cert/concertdacote-key.pem')
    , cert = fs.readFileSync('./cert/concertdacote-cert.pem')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , compression = require('compression')
    , favicon = require('serve-favicon')
    , morgan = require('morgan')
    , mongojs = require('mongojs')
    , dbUrl = process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote'
    , db = mongojs(dbUrl, ['concerts'])
    , flash = require('connect-flash')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , db2 = mongojs(dbUrl, ['htpasswd'])
    , bcrypt = require('bcrypt')
    , https_options = { key: key, cert: cert }
    , util = require('util');

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

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user['_id']);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(function(username, password, done) {
// asynchronous verification, for effect...
process.nextTick(function () {
// Find the user by username. If there is no user with the given
// username, or the password is not correct, set the user to `false` to
// indicate failure and set a flash message. Otherwise, return the
// authenticated `user`.
findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      bcrypt.compare(password, user.password, function(err, res) {
      if (!res) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
      });
    });
  });
}));

/*
 * Getting data from database filtered by artist and client's date
 */
app.get('/@', function(req, res){
  if (req.query.l) l = req.query.l;
  else l = 5000;
  if(req.query.date) date = req.query.date;
  else date = new Date();
  var dbQuery = { latlong: {
  	    $near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
  	    $maxDistance: parseFloat(req.query.range)/111.12}
      };
  dbQuery.startDate = { $gte : new Date(date)};
  if(req.query.artist) {
    dbQuery.artist = new RegExp(req.query.artist, 'i');
    db.concerts.find( dbQuery, { 'limit' : l }, function(err, result) {
	    if(!err) {
        console.log('# of concerts returned = ' + result.length);
        res.send(result); 
      } else console.log(err);
	  });
  } else {
    db.concerts.find( dbQuery, { 'limit' : l }, function(err, result) {
   	  if(!err) {
        console.log('# of concerts returned = ' + result.length);
        res.send(result); 
      } else console.log(err);
    });
  }
});


/*
 * Dashbord Area
 */
app.get('/maj', ensureAuthenticated, function(req, res){
	startUpdate();
	res.render('dashbord', {user: req.user, message: 'Update Started!' });
});

app.get('/dashbord', function(req, res){
  res.render('dashbord', { user: req.user, message: ''});
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/dashbord');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);
https.createServer(https_options, app).listen(process.env.PORT+443 || 3443);
console.log('server listening on port 3000 (HTTP) || 3443 (HTTPS) || ' + process.env.PORT);


/*********** Methods *************/

function startUpdate(fn){
	var requestLastfm = require('./req-json-lastfm.min');
	requestLastfm.startUpdate();
}

/*
 * Get a user by id from database (ref. db2 htpasswd)
 */
function findById(id, fn) {
  db2.htpasswd.findOne({_id: id}, function(err, results){
    if (results) {
      fn(null, results);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

/*
 * Get a user by username from database (ref. db2 htpasswd)
 */
function findByUsername(username, fn) {
  db2.htpasswd.findOne({'username': username}, function(err, results){
    if (results) {
      return fn(null, results);
    } 
    return fn(null, null);
  });
}

/*
 * Generate a hash from a given string phrase (pass)
 * output: a hashed pass
 */
function encryptPass(pass, fn){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
        if(hash){ return fn(null, hash); }
        return fn(null, null);
      });
  });
}

/*
 * Insert a user into database (db2 htpasswd)
 * Note: not complete, needs verification of existing username
 */
function addUser (user, pass) {
  encryptPass(pass, function(err, hash){
    db2.htpasswd.insert({'username' : user, 'password' : hash});
  });
}

/*
 * Change the password with 'pass' for a given username 'user'
 */
function changePass (user, pass) {
  encryptPass(pass, function(err, hash) { 
    db2.htpasswd.update({'username': user}, {$set: {'password': hash},});
  });
}

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}