var express = require( 'express' );
var router  = express.Router();

var home      = require( './home' );
var notes     = require( './notes' );
var classes   = require( './classes' );
var upload    = require( './upload' );

var isAuthenticated = function( req, res, next ) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if( req.isAuthenticated() ) {
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	res.redirect( '/' );
}

module.exports = function( passport ) {
	router.get( '/', function( req, res ) {
		if( req.isAuthenticated() ) {
			console.log( 'user logged in already' );
			res.redirect( '/home' );
		}
		else {
			res.render( 'sign-in' );
		}
	});

	router.post( '/login', passport.authenticate( 'login', {
		successRedirect : '/home',
		failureRedirect : '/'
	}));

	router.get( '/register', function( req, res ) {
		res.render( 'register' );
	});

	router.post( '/register', passport.authenticate( 'register', {
		successRedirect: '/home',
		failureRedirect: '/'
	}));

	router.get( '/logout', function( req, res ) {
		req.logout();
		res.redirect( '/' );
	});

	router.use( '/home', home );
	router.use( '/classes', classes );
	router.use( '/notes', notes );
	router.use( '/upload', upload );

	return router;
}