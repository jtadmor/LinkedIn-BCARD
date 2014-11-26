var React = require('react')

var indexController = {

	// Home / login page
	home: function(req, res) {
		res.render('home');
	},
	// Viewing and editing a card
	viewCard: function(req, res) {
		// Render the page
		res.send('Hello!');
	}
};

module.exports = indexController;