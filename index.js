// Require libraries and controllers
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var indexController = require('./Controllers/indexController');
var linkController = require('./Controllers/linkController');
var apiController = require('./Controllers/apiController');

// Set up the app 
var app = express();
app.set('view engine','jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// DB connection
// "mongodb://user:pass@server.compose.io:port_name/db_name"
var mongoDB_URL = process.env.MONGOHQ_URL || 'mongodb://localhost'
mongoose.connect(mongoDB_URL + '/bcards');

// ROUTES

// Home
app.get('/', indexController.home);

// Authenticate with LinkedIn and get profile info
app.get('/reqauth', linkController.requestAuthCode);
app.get('/auth', linkController.getProfile);

// View / edit your card
app.get('/view/:id', indexController.viewCard);

// Retrieving and saving profile info from the database
app.get('/getProfile/:id', apiController.getProfile);
app.post('/saveProfileData', apiController.saveProfileData);

// Create port
var port = process.env.PORT || 3000;
var server = app.listen(port);

