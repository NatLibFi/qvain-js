import parseJwt from './jwt.js'

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
	var jwt = parseJwt(token)

	if (jwt && jwt['sub']) {
		let user = new User()
		user.id = jwt['sub']
		user.name = jwt['name'] || ""
		user.email = jwt['email'] || ""
		user.expires = jwt['exp'] ? parseUnixTime(jwt.exp) : null

		// FairData specific
		user.projects = jwt['group_names'] ? filterGroups("fairdata:IDA", jwt['group_names']) : []

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

	// split third colon and accept numbers only
	return groups.filter(grp => grp.startsWith(prefix)).map(grp => grp.split(":", 3)[2]).filter(grp => !isNaN(grp))
}

function Auth(url) {
	this.url = url
	this._user = null

	Object.defineProperty(Auth.prototype, "loggedIn", {
		get: function() {
			return this._user !== null
		}
	})
	Object.defineProperty(Auth.prototype, "user", {
		get: function() {
			return this._user
		}
	})
}
Auth.prototype.constructor = Auth

Auth.prototype.login = function(token) {
	this._user = UserFromToken(token)

	if (this._user !== null) {
		localStorage.setItem(TokenName, token)
		return true
	}
	localStorage.removeItem(TokenName)
	return false
}

Auth.prototype.logout = function() {
	this._user = null
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
