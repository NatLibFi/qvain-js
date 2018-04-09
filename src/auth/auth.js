import parseJwt from './jwt.js'

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
		user._jwt = jwt
		return user
	}
	return null
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
		localStorage.setItem('jwt', token)
		return true
	}
	localStorage.removeItem('jwt')
	return false
}

Auth.prototype.logout = function() {
	this._user = null
	localStorage.removeItem('jwt')
}

export default Auth
