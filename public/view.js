// requestToken
// @param: the authorization code
var requestToken = function(authCode) {

	// Create the URL modularly to allow for easy editing
	var base = 'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code';		
	var code = '&code='+ authCode;
	var redirect = '&redirect_uri=http://localhost:3000/auth';
	var api = '&client_id=78n4kzsmz4le0g';
	var secret = '&client_secret=JtmXjnn66CoQ8n3U';
	var url = base + code + redirect + api + secret;

	$.ajax({
		type: "POST",
		url: url,
		data: {
			// grant_type: 'authorization_code',
			// code: authCode,
			// redirect_uri: 'http://localhost:3000/auth',
			// client_id: '78n4kzsmz4le0g',
			// client_secret: 'JtmXjnn66CoQ8n3U'
		},
		success: function(data) {
			console.log(data);
		},
		error: function(jQXHR, status, errorThrown) {
			console.log('Error with request:',errorThrown);
		}
	});

}

// Get the code
$(document).on('ready', function() {

	var authCode = $('.auth-code-container').data('id');
	
	// Request Token
	requestToken(authCode);
});