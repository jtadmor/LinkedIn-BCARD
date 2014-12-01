// Controll the rendering of views for the client
var indexController = {

	// Home / login page
	home: function(req, res) {
		res.render('home');
	},
	// Viewing and editing a card for a given user
	viewCard: function(req, res) {
		res.render('card', {id: req.params.id});
	},

};

module.exports = indexController;