// CODE FOR AUTHENTICATING THE USER

// Event handler for the Authentication Click
// var eventAuthClick = function() {

// }

var AuthButton = React.createClass({

	// Display name for the button
	displayName: 'AuthButton',
	// Event handler for clicking on the button
	handleClick: function(e) {
		return;
	},
	// Render the button
	render: function() {
		return (React.createElement('button', {className: 'auth-btn', id: 'auth-btn', onClick: this.handleClick}, 'Click!'));
	}
});

React.render(React.createElement(AuthButton, null), document.getElementById('auth-btn-container'));

