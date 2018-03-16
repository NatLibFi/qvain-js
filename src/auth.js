import {router} from '../app.js'

// URL and endpoint constants
//const API_URL = 'http://localhost:3001/'
//const LOGIN_URL = API_URL + 'sessions/create/'
//const SIGNUP_URL = API_URL + 'users/'

const AUTH_URL = 'http://id.example.com/'
const LOGIN_URL = AUTH_URL + 'login'
const SIGNUP_URL = AUTH_URL + 'create'


// http://stackoverflow.com/a/38552302
function parseJwt(token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.parse(window.atob(base64));
};

function tryParseJwt(token) {
	try {
		var u = parseJwt(token);
	} catch(e) {
		console.log("error parsing jwt:", e);
		return {};
	}
	return u
}


var UserType = {
	uid: "",
	name: "",
	isAdmin: false,
	isSet: false,
	//url: "",
	
	get url() {
		return "//example.com/user/" + this.uid;
	},
	
	getUid: function() {
		return this.uid;
	},
	getName: function() {
		return this.name;
	},
	isAuthenticated: function() {
		// if the server returns a UUID, the user is considered authenticated
		return this.uid.length > 0 ? true : false;
	},
};


function UserFromToken(token) {
	// empty user object
	var user = UserType;
	
	// try to parse token
	try {
		var jwt = parseJwt(token);
	} catch(e) {
		console.log("error parsing jwt:", e);
		// ...can't parse token, return empty user
		return user;
	}
	
	// invalid: no subject field (uid), return empty user
	if (!('sub' in jwt)) {
		return user;
	}
	
	// valid, set user object fields
	user.uid = jwt.sub;
	user.name = jwt.name || "";
	user.isAdmin = jwt.admin ? true : false;
	user.isSet = true;
	
	return user;
};

const testJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNTNiZmZiY2M0MWVkYWQ0ODUzYmVhOTFmYzQyZWExOCIsIm5hbWUiOiJXb3V0ZXIgVmFuIEhlbWVsIiwiYWRtaW4iOnRydWV9.SzRhDZOKW2l1Y5VTNin43vxfbZ86QXhPVULpidMVyE8";


export default {
	
	// User object will let us check authentication status
	user: {
		authenticated: false
	},
	
	// Send a request to the login URL and save the returned JWT
	login(context, creds, redirect) {
		context.$http.post(LOGIN_URL, creds, (data) => {
			localStorage.setItem('id_token', data.id_token)
			localStorage.setItem('access_token', data.access_token)
			
			this.user.authenticated = true
			
			// Redirect to a specified route
			if (redirect) {
				router.go(redirect)        
			}
			
		}).error((err) => {
			context.error = err
		})
	},
	
	signup(context, creds, redirect) {
		context.$http.post(SIGNUP_URL, creds, (data) => {
			localStorage.setItem('id_token', data.id_token)
			localStorage.setItem('access_token', data.access_token)
			
			this.user.authenticated = true
			
			if(redirect) {
				router.go(redirect)        
			}
			
		}).error((err) => {
			context.error = err
		})
	},
	
	// To log out, we just need to remove the token
	logout() {
		localStorage.removeItem('id_token')
		localStorage.removeItem('access_token')
		this.user.authenticated = false
	},
	
	checkAuth() {
		var jwt = localStorage.getItem('id_token')
		if (jwt) {
			this.user.authenticated = true
		}
		else {
			this.user.authenticated = false      
		}
	},
	
	// The object to be passed as a header for authenticated requests
	getAuthHeader() {
		return {
			'Authorization': 'Bearer ' + localStorage.getItem('access_token')
		}
	}
}
