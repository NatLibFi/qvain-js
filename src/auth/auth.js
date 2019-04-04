import {parseJwt, getRandomString} from './jwt.js'

const TokenName = "jwt"

function User() {
	this.id = ""
	this.name = ""
	this.email = ""
	this._jwt = null
}
User.prototype.constructor = User

User.prototype.getId = function() {
	this._id.length > 0 ? this._id : null
}

function UserFromToken(token) {
	let jwt = parseJwt(token)

	if (jwt && jwt['sub']) {
		let user = new User()

		// Join given_name and family_name if available
		const nameParts = []
		if (jwt['given_name']) {
			nameParts.push(jwt['given_name']);
		}
		if (jwt['family_name']) {
			nameParts.push(jwt['family_name']);
		}
		user.name = nameParts.join(" ") || jwt['name'] || ""
		user.id = jwt['CSCUserName'] || jwt['sub']
		user.email = jwt['email'] || ""
		user.expires = jwt['exp'] ? parseUnixTime(jwt.exp) : null

		// Get IDA projects
		if (jwt['group_names']) {
			user.projects =
				filterGroups("fairdata:IDA01:", jwt['group_names']) // old prefix
				.concat(filterGroups("IDA01:", jwt['group_names'])) // new prefix
		} else {
			user.projects = []
		}

		// SAML/HAKA
		user.eppn = jwt['eppn'] || null
		user.organisation = jwt['schacHomeOrganization'] || null
		user.organisation_type = jwt['schacHomeOrganizationType'] || null

		// cache for debugging purposes
		user._jwt = jwt
		return user
	}
	return null
}

// CSC/IDA specific: Get the project number of those projects that are IDA projects
// fairdata:IDA01:2001036 --> 2001036
function filterGroups(prefix, groups) {
	// strip first dot
	//return groups.filter(grp => grp.startsWith(prefix).map(grp => grp.substring(grp.indexOf(":")+1))

	// strip until last dot
	//return groups.filter(grp => grp.startsWith(prefix).map(grp => grp.substring(grp.indexOf(":")+1))

	// remove prefix and accept numbers only
	return groups.filter(grp => grp.startsWith(prefix)).map(grp => grp.substring(prefix.length)).filter(grp => !isNaN(grp))
}

function Auth(url) {
	this.url = url

	// might be Vue's reactive setter
	this.defineProperty(Auth.prototype, "_user", {
		value: null,
		writable: true,
	})

	Object.defineProperty(Auth.prototype, "loggedIn", {
		get: function() {
			// WARNING: Do not compare to null! Vue observed objects will not equal null as they have at least the __ob__ key. Check for a specific property.
			//return this._user !== null
			return this._user && 'id' in this._user
		},
	})

	Object.defineProperty(Auth.prototype, "user", {
		get: function() {
			return this._user
		},
	})

	Object.defineProperty(Auth.prototype, "loginUrl", {
		get: function() { return this.url + '?' + getRandomString(8) },
	})
}
Auth.prototype.constructor = Auth

Auth.prototype.setUser = function(user) {
	this._user = user
}

Auth.prototype.login = function(token) {
	this.setUser(UserFromToken(token))

	if (this.loggedIn) {
		localStorage.setItem(TokenName, token)
		return true
	}
	localStorage.removeItem(TokenName)
	return false
}

Auth.prototype.logout = function() {
	// TODO: maybe empty object?
	this.setUser(null)
	localStorage.removeItem(TokenName)
}

Auth.prototype.localLogin = function() {
	const token = localStorage.getItem(TokenName)
	if (token && !isExpiredToken(token)) {
		return this.login(token)
	}
	localStorage.removeItem(TokenName)
	return false
}

Auth.prototype.defineProperty = Object.defineProperty

// parseUnixTime converts seconds to epoch to a Javascript date object, or null in case of error.
function parseUnixTime(secs) {
	const date = new Date(0)
	date.setUTCSeconds(secs)
	if (isNaN(date)) {
		return null
	}
	return date
}

// getExpirationDateFromToken returns a date based on the the 'exp' field from a JWT or undefined if that field wasn't set.
function getExpirationDateFromToken(token) {
	const jwt = parseJwt(token)

	if (!jwt || !('exp' in jwt)) {
		//return null
		return undefined
	}

	return parseUnixTime(jwt.exp)
}

// isExpiredToken checks if a token is expired by comparing the 'exp' field with the current date;
// invalid dates will return null, which will evaluate to 0 (true, expired), undefined dates will evaluate to NaN (false, not expired).
function isExpiredToken(token) {
	const date = getExpirationDateFromToken(token)
	return date < new Date()
}

export default Auth
