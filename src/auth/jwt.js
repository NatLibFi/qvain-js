// b64DecodeUnicode function taken from Mozilla website.
function b64DecodeUnicode(str) {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}

// decode_base64_url decodes URL encoded base64, taking unicode characters into consideration.
function decode_base64_url(text) {
	let base64 = text.replace(/-/g, "+").replace(/_/g, "/")
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
		throw 'Invalid base64url string'
	}
	return b64DecodeUnicode(base64)
}

export default function parseJwt(token) {
	try {
		let payload = token.split('.')[1]
		let decoded = decode_base64_url(payload)
		console.warn("decoded:", decoded)
		return JSON.parse(decoded)
	} catch(error) {
		console.error("parseJwt():", error)
		return null
	}
}
