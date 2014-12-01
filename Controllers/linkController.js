// Requires
var https = require('https');
var Profile = require('../Models/Profile');

// HELPERS

// makeProfileNice: Takes the returned LinkedIn profile information and gets only the useful information so it can be properly saved in the database
// @params: user profile_info
// @return: an object representing the profile in the correct form
// CALLED FROM: checkForProfile, if no profile was found and the profile_info is to be saved
var makeProfileNice = function(profile_info) {
	return {
		// Properties that are fine as is:
		id: profile_info.id,
		emailAddress: profile_info.emailAddress,
		pictureURL: profile_info.pictureUrl,
		headline: profile_info.headline,

		// Combine first and last names
		name: profile_info.firstName + ' ' + profile_info.lastName,
		
		// For location, grab the name property from the location object
		location: profile_info.location.name,

		// Return only the company name and position title of the most recent position (first element of 'values' array) as separate fields
		company: profile_info.positions.values[0].company.name, 
		title: profile_info.positions.values[0].title,

		// For skills, grab all the 'name' fields from the 'skill' object within the 'values' array
		skills: profile_info.skills.values.map(function(value) {
			return value.skill.name;
		}),

		// Create a blank editing password for time being
		edit_pw: ''
	};
};

// checkForProfile: Checks to see if a user's profile exists, otherwise saving the profile data
// @params: user profile_info from LinkedIn (including id), the express response object
// CALLED FROM: getLinkedInProfile, once profile is obtained
var checkForProfile = function(profile_info, res) {
	Profile.findOne({id: profile_info.id}, function(error, profile) {

		// error handling
		if (error) {
			console.log(error);
		}

		// If a profile is found, redirect the user to the profile viewing page
		if (profile) {
			res.redirect('/view/'+profile_info.id);
		}
		// If no profile is found, call makeProfileNice to streamline the profile_info, then save it into the database and redirect the user
		else {
			Profile.create(makeProfileNice(profile_info), function(err, profile) {
				if (err) {
					console.log(err);
				}
				res.redirect('/view/'+profile.id);
			});
		}
	});
};

// getLinkedInProfile: Retrieves the user's profile info
// @params: user access_token, the express response object
// CALLBACK FOR THE POST REQUEST THAT GRABS THE TOKEN
var getLinkedInProfile = function(token, res) {

	var options = {
		hostname: 'api.linkedin.com',
		path: '/v1/people/~:(id,first-name,last-name,picture-url,location:(name),headline,positions,skills,email-address)',
		headers: {
			Authorization: 'Bearer ' + token,
			'x-li-format': 'json'
		}
	};

	var get = https.get(options, function(response) {
		var jstr = '';

		// Add in data in chunk form
		response.on('data', function(data) {
			jstr += data;
		});

		// When the response is done, pass the profile into and the res object to checkForProfile
		response.on('end', function() {
			var profile_info = JSON.parse(jstr);
			checkForProfile(profile_info, res);
		});
	});
};

var linkController = {
	// Getting an auth code from LinkedIn
	requestAuthCode: function(req, res) {
		
		// Create the request URL
		var base = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code';
		var api = '&client_id=78n4kzsmz4le0g';
		var scope = '&scope=r_fullprofile%20r_emailaddress';
		var state = '&state=NinjasInPijamas';
		var redirect = '&redirect_uri=http://localhost:3000/auth/';
		var url = base + api + scope + state + redirect;

		// And redirect
		res.redirect(url);
	},
	// Trade auth code for access token, use token to retrieve profile
	getProfile: function(req, res) {

		// Check to make sure the incoming request state is correct
		if (req.query.state !== 'NinjasInPijamas') {
			res.end();
		}

		// If an auth code was sent back, send a POST request to get the access token
		else if (req.query.code) {

			// Set up the url for the request
			var host = 'www.linkedin.com';
			var path = '/uas/oauth2/accessToken?grant_type=authorization_code';		
			var code = '&code='+ req.query.code;
			var redirect = '&redirect_uri=http://localhost:3000/auth/';
			var api = '&client_id=78n4kzsmz4le0g';
			var secret = '&client_secret=JtmXjnn66CoQ8n3U';
			
			// Set up the options for the post request
			var options = {
				hostname: host,
				path: path + code + redirect + api + secret,
				method: 'POST' 
			};

			// REQUEST TO RECEIVE THE TOKEN
			var request = https.request(options, function(response) {
				var jstr = '';

				// Add in data in chunk form
				response.on('data', function(data) {
					jstr += data;
				});

				// When the response is done, call getLinkedInProfile with the newly obtained access token and the res object from the original client-side call
				response.on('end', function() {
					var token = JSON.parse(jstr).access_token;
					getLinkedInProfile(token, res);
				});				
			});
			// End the POST request
			request.end();
		}

		// Error logging
		else {
			console.log(req.query.error_description);
			res.send(req.query.error_description);
		}
	}
};

module.exports = linkController;