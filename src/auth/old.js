// https://github.com/auth0/jwt-decode

// http://stackoverflow.com/a/38552302
function parseJwt(token) {
	let base64Url = token.split('.')[1]
	let base64 = base64Url.replace('-', '+').replace('_', '/')
	return JSON.parse(window.atob(base64))
}


let UserType = {
	uid: "",
	name: "",
	isAdmin: false,
	isSet: false,
	//url: "",
	
	get url() {
		return "//example.com/user/" + this.uid
	},
	
	getUid: function() {
		return this.uid
	},
	getName: function() {
		return this.name
	},
	isAuthenticated: function() {
		// if the server returns a UUID, the user is considered authenticated
		return this.uid.length > 0 ? true : false
	},
}


// UserFromToken parses a JWT and returns a user object or null in case of error.
function UserFromToken(token) {
	// empty user object
	let user = UserType
	let jwt
	
	// try to parse token
	try {
		jwt = parseJwt(token)
	} catch(e) {
		console.log("error parsing jwt:", e)
		// ...can't parse token, return empty user
		return null
	}
	
	// invalid: no subject field (uid), return empty user
	if (!('sub' in jwt)) {
		return null
	}
	
	// valid, set user object fields
	user.uid = jwt.sub
	user.name = jwt.name || ""
	user.isAdmin = jwt.admin ? true : false
	user.isSet = true
	
	return user
}


export { UserFromToken }
