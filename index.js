// Require libraries and controllers
var express = require('express');
var mongoose = require('mongoose');
var React = require('react');

var indexController = require('./Controllers/indexController');
var apiController = require('./Controllers/apiController');

// Set up the app 
var app = express();
app.set('view engine','jade');
app.use(express.static(__dirname + '/public'));

// DB connection
mongoose.connect('mongodb://localhost/bcards');

// ROUTES

// Home / login
app.get('/', indexController.home);

// View / edit your card
app.get('/:username', indexController.viewCard);

// Create port
var port = process.env.PORT || 3000;
var server = app.listen(port);

