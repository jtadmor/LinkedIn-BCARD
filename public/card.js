// DISPLAY AND EDIT THE USERS BUSINESS CARD

// The business card holder
var BusinessCard = React.createClass({displayName: 'BusinessCard',

	// Set the initial state to empty profile and a generic title 
	getInitialState: function() {
		return {profile: {}, title: 'Check Out This Snazzy Business Card!'};
	},

	// Once the profile data is fetched from the server, render the business card
	loadProfileData: function() {
		$.ajax({
			url: '/getProfile/' + this.props.user_id,
			dataType: 'json',
			success: function(data) {
				this.setState({profile: data});
			}.bind(this)
		});
	},

	// When rendered into DOM, load data
	componentDidMount: function() {
		this.loadProfileData();
	},
	
	// When the card is saved, post the updated profile data to the server api to write into the database (note that we do not have to grab any of the field values, as state is set every time an individual field is edited), then change the view title so the user is aware the save was successful
	saveCard: function() {
		$.ajax({
			url: '/saveProfileData',
			type: 'POST',
			data: this.state.profile,
			success: function() {
				this.setState({title: 'Your New Card Has Been Saved!'});
			}.bind(this)
		});
	},

	// When a field is changed, change the state of the business card and change the title to reflect that it is being edited
	saveField: function(field, val) {
		var newProfile = this.state.profile;
		newProfile[field] = val;
		this.setState({profile: newProfile, title: 'Change Is Afoot!'});
	},

	// When the password is submitted, check to see if the user has an edit_pw set. If not, set it and allow user to save edits. Otherwise, check it and only allow user to edit if the passwords match. Do nothing if an empty form is submitted.
	submitPassword: function(e) {

		e.preventDefault();

		// Get the password guess
		var pw_entered = this.refs.pw.getDOMNode().value;

		// Do nothing if no password was submitted
		if (!pw_entered) {
			return;
		}

		// If no password exists, save it and allow the user to save changes
		if (!this.state.profile.edit_pw) {
			// Change states
			var newProfile = this.state.profile;
			newProfile.edit_pw = pw_entered;
			this.setState({profile: newProfile});
			// Hide the form, (note: this is hacky, but unmountComponentAtNode was not working...) and render the save button
			$('#password-form').hide();
			React.render(React.createElement("button", {className: "card-save", onClick: this.saveCard}, "Save Card"), document.getElementById('save-card-container'));
		}
		// If a password exists and matches the entry, allow user to save
		else if (this.state.profile.edit_pw === pw_entered) {
			$('#password-form').hide();
			React.render(React.createElement("button", {className: "card-save", onClick: this.saveCard}, "Save Card"), document.getElementById('save-card-container'));
		}
		// If the passwords don't match, display an error
		else {
			$('#password-input').val('Wrong Password');
		}
	},

	// The render function returns a title, a div containing all of the subcomponents, and the input to enter or set a password
	render: function() {
		var profile = this.state.profile;
		return (
			React.createElement("div", {className: "master-container"}, 
				/* Title at top of page*/
				React.createElement("h1", {className: "dancing"}, this.state.title), 
				/* Container for the card and all the subcomponents */
				React.createElement("div", {className: "business-card-container"}, 
					/* Picture box and form to edit the URL */
					React.createElement(Picture, {saveField: this.saveField.bind(this, 'pictureURL'), data: profile.pictureURL}), 
					/* Other fields */
					React.createElement("div", {className: "name-container"}, 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this, 'name'), data: profile.name})
					), 
					React.createElement("div", {className: "headline-container"}, 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this,'headline'), data: profile.headline})
					), 
					React.createElement("div", {className: "position-container"}, 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this,'title'), data: profile.title}), 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this,'company'), data: profile.company})
					), 
					React.createElement(SkillsList, {saveField: this.saveField.bind(this,'skills'), data: profile.skills}), 
					React.createElement("div", {className: "contact-container"}, 
						React.createElement("p", null, "CONTACT:"), 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this,'emailAddress'), data: profile.emailAddress}), 
						React.createElement(ProfileField, {saveField: this.saveField.bind(this,'location'), data: profile.location})
					)
				), 
				/* Container for save button */
				React.createElement("div", {className: "save-card-container", id: "save-card-container"}), 
				/* Password form */
				React.createElement("form", {className: "password-form", id: "password-form", onSubmit: this.submitPassword}, 
					React.createElement("input", {type: "text", id: "password-input", placeholder: "Enter password to save", ref: "pw"}), 
					React.createElement("input", {type: "submit"})
				)
			)
		);
	}
});

// GENERIC FIELD ON BUSINESS CARD
// Covers everything but picture and skills list
// The data is saved into the React component state so that it can change once data comes in from the server and so that the user can change it
var ProfileField = React.createClass({displayName: 'ProfileField',
	// Grab the initial state from the props that are sent in
	getInitialState: function() {
		return {data: this.props.data};
	},
	// When a new prop comes in (data is loaded), change the state
	componentWillReceiveProps: function(newprops) {
		this.setState({data: newprops.data});
	},
	// On changing the input, change the state internally and call the BusinessCard's saveField method to change the state there as well
	handleChange: function(e) {
		this.setState({data: e.target.value});
		this.props.saveField(e.target.value);
	},
	// Render with the state value
	render: function() {
		var value = this.state.data;
		return React.createElement("input", {className: "card-field", value: value, onChange: this.handleChange});
	}
});

// BUSINESS CARD PICTURE
var Picture = React.createClass({displayName: 'Picture',
	// Receiving the saved URL
	getInitialState: function() {
		return {data: this.props.data};
	},
	componentWillReceiveProps: function(newprops) {
		this.setState({data: newprops.data});
	},
	// Changing state and saving to business card
	saveChange: function(e) {
		e.preventDefault();

		// Get the new img URL
		var newUrl = this.refs.img_input.getDOMNode().value;

		// Update states here and for Business Card 
		this.setState({data: newUrl});
		this.props.saveField(this.props.field, newUrl);

		// Hide the form
		$('.image-form').hide();
	},

	// Showing the input to change the image
	showInput: function() {
		$('.image-form').toggle();
	},

	render: function() {
		var source = this.state.data;
		return (
			React.createElement("div", {className: "img-container"}, 
				React.createElement("img", {src: source, onClick: this.showInput}), 
				React.createElement("form", {className: "image-form", onSubmit: this.saveChange}, 
					React.createElement("input", {type: "url", defaultValue: this.state.data, className: "image-input", ref: "img_input"}), 
					React.createElement("input", {type: "submit"})
				)
			)
		);
	}
});

// SKILLS
var SkillsList = React.createClass({displayName: 'SkillsList',
	getInitialState: function() {
		return {data: this.props.data};
	},
	componentWillReceiveProps: function(newprops) {
		this.setState({data: newprops.data});
	},
	handleChange: function(index, e) {
		var skills = this.state.data;
		skills[index] = e.target.value;
		this.setState({data: skills});
		this.props.saveField(skills);
	},
	render: function() {
		// Generate the list of skills
		if (this.state.data) {
			// Set up context for the individual skills' onChange function
			var hC = this.handleChange;
			var that = this;
			// Create the skills nodes
			var skillsNode = this.state.data.map(function(skill, index) {
				return React.createElement("input", {className: "one-skill", defaultValue: skill, onChange: hC.bind(that, index)});
			});
			// Return the skills node in a div
			return (
				React.createElement("div", {className: "skills-holder"}, 
					React.createElement("p", null, "SKILLS:"), 
					skillsNode
				)
			);
		}
		else {
			return React.createElement("div", {className: "skills-holder"});
		}
	}
});


// Render the Business Card with the user_id onto the body)
React.render(React.createElement(BusinessCard, {user_id: user_id}), document.body);
