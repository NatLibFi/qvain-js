function decode_base64_url(text) {
	var base64 = text.replace(/-/g, "+").replace(/_/g, "/")
	switch (base64.length % 4) {
		case 0:
			break
		case 2:
			base64 += '=='
			break
		case 3:
			base64 += '='
			break
		default:
			throw 'Illegal base64url string!'
	}
	return window.atob(base64)
}

export default function parseJwt(token) {
	var jwt
	try {
		var payload = token.split('.')[1]
		var decoded = decode_base64_url(payload)
		jwt = JSON.parse(decoded)
	} catch(error) {
		console.log(error)
		jwt = null
	} finally {
		return jwt
	}
}
