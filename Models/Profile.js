var mongoose = require('mongoose');

// Schema for the user profile 
// (Note: this does not include all of the information the LinkedIn API sends, leaving out some data such as field IDs and extensive position information)
// Set _id to false in options as we do not need ids for the doc 
var profileSchema = mongoose.Schema({
	id: String,
	name: String,
	emailAddress: String,
	headline: String,
	location: String,
	pictureURL: String,
	company: String, 
	title: String,
	skills: [String],
	edit_pw: String,
});

module.exports = mongoose.model('profile', profileSchema);