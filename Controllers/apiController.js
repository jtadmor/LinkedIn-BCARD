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
		console.log('data sent:', req.body)
		var profile = req.body;
		delete profile._id;
		console.log('profile to save:', profile);
		Profile.findOneAndUpdate({_id: req.body._id}, {$set: profile}, function(err, doc) {
			if (err)
				console.log(err)
			console.log('saved doc:', doc);
			res.send('Great success!');
		});
	}
};

module.exports = apiController;