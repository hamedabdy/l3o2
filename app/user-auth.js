#!/usr/bin/env node

var mongojs     	= require('mongojs');
var configDB 		= require('../config/database');
var db 			= mongojs(configDB.url, ['htpasswd']);
var LocalStrategy 	= require('passport-local').Strategy;
var bcrypt 			= require('bcrypt');

module.exports = function(app, passport) {
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
	 * Dashbord Area
	 */
	app.get('/maj', ensureAuthenticated, function(req, res){
		startUpdate();
		res.render('dashbord', {user: req.user, message: 'Update Started!' });
	});

	app.get('/admin', function(req, res){
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
}


/*********** Methods *************/

function startUpdate(fn){
	var requestLastfm = require('./req-json-lastfm');
	requestLastfm.startUpdate();
}

/*
 * Get a user by id from database (ref. db htpasswd)
 */
function findById(id, fn) {
  db.htpasswd.findOne({_id: id}, function(err, results){
    if (results) {
      fn(null, results);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

/*
 * Get a user by username from database (ref. db htpasswd)
 */
function findByUsername(username, fn) {
  db.htpasswd.findOne({'username': username}, function(err, results){
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
 * Insert a user into database (db htpasswd)
 * Note: not complete, needs verification of existing username
 */
function addUser (user, pass) {
  encryptPass(pass, function(err, hash){
    db.htpasswd.insert({'username' : user, 'password' : hash});
  });
}

/*
 * Change the password with 'pass' for a given username 'user'
 */
function changePass (user, pass) {
  encryptPass(pass, function(err, hash) {
    db.htpasswd.update({'username': user}, {$set: {'password': hash},});
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