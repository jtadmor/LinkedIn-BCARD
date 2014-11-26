// Require libraries and controllers
var express = require('express');
var mongoose = require('mongoose');
var React = require('react');
var bodyParser = require('body-parser');

var indexController = require('./Controllers/indexController');
var apiController = require('./Controllers/apiController');

// Set up the app 
var app = express();
app.set('view engine','jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// DB connection
// mongoose.connect('mongodb://localhost/bcards');

// ROUTES

// Home
app.get('/', indexController.home);

// Authenticate with LinkedIn
app.get('/reqauth', apiController.requestAuthCode);
app.get('/auth', apiController.getToken);

// View / edit your card
app.get('/view/:username', indexController.viewCard);

// Create port
var port = process.env.PORT || 3000;
var server = app.listen(port);

