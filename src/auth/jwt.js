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
	try {
		var payload = token.split('.')[1]
		var decoded = decode_base64_url(payload)
		return JSON.parse(decoded)
	} catch(error) {
		console.log(error)
		return null
	}
}
