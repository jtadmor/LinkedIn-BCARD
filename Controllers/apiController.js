// Requires
var Profile = require('../Models/Profile');

// Define methods for retrieving and saving profile data
var apiController = {
	
	// Find the user profile and send it back to the client
	getProfile: function(req, res) {
		Profile.findOne({id: req.params.id}).exec(function(err, profile) {
			if (err)
				console.log(err);
			else {
				res.send(profile);
			}
		});
	},

	// Save the user profile
	saveProfileData: function(req, res) {
		// Grab the id, field that was edited, and the new value from req.body
		// Find by id and update
		// No need to send anything back because it is already re-rendered on the client
		Profile.findOneAndUpdate({_id: req.body._id}, {$set: {
			name: req.body.name,
			emailAddress: req.body.emailAddress,
			headline: req.body.headline,
			location: req.body.location,
			pictureURL: req.body.pictureURL,
			company: req.body.company,
			title: req.body.title,
			skills: req.body.skills,
			edit_pw: req.body.edit_pw
		}}, function(err, doc) {
			if (err)
				console.log(err)
			console.log('saved doc:', doc);
			res.send('Great success!');
		});
	}
};

module.exports = apiController;