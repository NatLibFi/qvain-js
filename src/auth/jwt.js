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

// randomString generates a cryptographically secure random string with a given byte length.
// Function taken from the auth0.com website.
function cryptoRandomString(length) {
	let bytes = new Uint8Array(length)
	let random = window.crypto.getRandomValues(bytes)
	//var random = crypto.randomFillSync(bytes);

	let result = []
	let charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
	random.forEach(function (c) {
		result.push(charset[c % charset.length])
	})
	return result.join('')
}

// pseudoRandomString generates a not-so-cryptographically secure random string.
function pseudoRandomString(length) {
	let out = ""
	let charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'

	for (let i = 0; i < length; i++)
		out += charset.charAt(Math.floor(Math.random() * charset.length))

	return out
}

function getRandomString(length) {
	let rs
	try {
		rs = cryptoRandomString(length)
	} catch(error) {
		console.warn("getRandomString(): error calling crypto API function, falling back to insecure random generator; error was:", error.toString())
		rs = pseudoRandomString(8)
	}
	return rs
}


function parseJwt(token) {
	try {
		let payload = token.split('.')[1]
		let decoded = decode_base64_url(payload)
		return JSON.parse(decoded)
	} catch(error) {
		console.error("parseJwt():", error)
		return null
	}
}

export { parseJwt, getRandomString }
