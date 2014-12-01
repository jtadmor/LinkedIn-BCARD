# CUSTOM BUSINESS CARDS

# HOSTED AT: https://fathomless-earth-5099.herokuapp.com/

# Organization:

# Controllers:
* apiController - calls to the database to save or retrieve profile info
* indexController - routing for the 'home' and 'card' views
* linkController - calls to LinkedIn's apis to get auth code, exchange for access token, and retrieve user profile data

# Models
* Profile - mongoose schema for the user profile data

# Views
* Card - viewing / editing the business card
* Home - the simple home page
* Layout - site template

# Public
* Styles - css for the site
* Card.js - creates the custom business card layout, functionality for filling in the card with user data, allowing edits, and saving back to the database

# Implementation Notes:
* Currently, the 'Card' view is rendered at app/view/:id. This has the benefit of allowing a user to easily return to the URL to edit their card (or send the URL to someone else to view the card). The downside is a slower load for users using the app for the first time, because rather than render a view directly with the profile information when it is received, the server sends the user's ID only to the client, which then loads the profile back from the database on the server. A better implementation would involve using React's render to string functionality to create HTML for the initial profile view on the back end.
* Because anyone can view a business card once it is created, the app implements a basic security system, allowing the user to set a password associated with the profile when first viewing it, and thereafter only allowing changes to be saved to a profile when the password is correctly entered.