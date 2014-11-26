var apiController = {
	// Authenticating with LinkedIn
	requestAuthCode: function(req, res) {
		
		// Create the redirect string modularized for easy editing
		var base = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code';
		var api = '&client_id=78n4kzsmz4le0g';
		var scope = '&scope=r_fullprofile%20r_emailaddress';
		var state = '&state=NinjasInPijamas';
		var redirect = '&redirect_uri=http://localhost:3000/auth';
		var url = base + api + scope + state + redirect;

		// And redirect
		res.redirect(url);
	},
	getToken: function(req, res) {
		// Check to make sure the state is correct
		if (req.query.state !== 'NinjasInPijamas') {
			res.send('State Denied: Top Secret Access Only');
		}
		// If an auth code was sent back, render the view
		else if (req.query.code) {
			// res.redirect('https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code='+req.query.code+'&redirect_uri=http://localhost:3000/auth&client_id=78n4kzsmz4le0g&client_secret=JtmXjnn66CoQ8n3U');
			res.render('view', {code: req.query.code});
		}
		// Error logging
		else {
			console.log(req.query.error_description || 'Bad State');
			res.send({error: req.query.error_description || 'Bad State'});
		}
	}
};

module.exports = apiController;