#!/usr/bin/env node

var express = require('express')
    , app = express()
    , mongojs = require('mongojs')
	, url = process.env.MONGOHQ_URL || 'mongodb://localhost/concertdacote'
	, db = mongojs(url, ['concerts'])
	, flash = require('connect-flash')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, db2 = mongojs(url, ['htpasswd'])
	, bcrypt = require('bcrypt')
	, MongoStore = require('connect-mongo')(express)
	, index = require('./js/app.js');

// configure Express
app.configure(function() {
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ 
    secret: 'concert_dacote',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(
      {db: 'concertdacote'},
      function(err) { if(!err) console.log('connect-mongodb setup ok!') }) }));
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(__dirname+'/'));
});

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
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
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
 * getting data from database
 */
app.get('/concert', function(req, res){
  var dbQuery = { latlong: {
	    $near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
	    $maxDistance: parseFloat(req.query.range)/111.12}};
  if (req.query.artist) {
    dbQuery.artist = new RegExp(req.query.artist, 'i');
    db.concerts.find( dbQuery, { limit : 5000 }, function(err, result) {
	  console.log(result.length);
	  if(err) console.log(err);
	  res.send(result);
	});
  }
  db.concerts.find( dbQuery, { limit : 5000 }, function(err, result) {
	  console.log(result.length);
	  if(err) console.log(err);
	  res.send(result);
	});
});

app.get('/artist', function(req, res, next){
  var dbQuery = { latlong: {
	    $near:[parseFloat(req.query.lat), parseFloat(req.query.long)],
	    $maxDistance: parseFloat(req.query.rayon)/111.12}};
  if (req.query.lat && req.query.long && req.query.rayon) {
    db.concerts.find( dbQuery, { limit : 5000 }, function(err, result) {
	  console.log(result.length);
	  if(err) console.log(err);
	  res.send(result);
	  next();
	  console.log(req.query);
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
console.log('Server listening on port 3000 || ' + process.env.PORT);


function startUpdate(fn){
	var requestLastfm = require('./req-json-lastfm.min');
	requestLastfm.startUpdate();
}

function findById(id, fn) {
  db2.htpasswd.findOne({_id: id}, function(err, results){
    if (results) {
      fn(null, results);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

function findByUsername(username, fn) {
  db2.htpasswd.findOne({'username': username}, function(err, results){
    if (results) {
      return fn(null, results);
    }
    return fn(null, null);
  });
}

function encryptPass(pass, fn){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
        // Store hash in your password DB.
        //db.htpasswd.update({'username': user}, {$set: {'password': hash},});
        if(hash){ return fn(null, hash); }
        return fn(null, null);
      });
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