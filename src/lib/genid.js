import murmurhash from '../../vendor/murmurhash/murmurhash3.js'

const prefix = 'q'
const salt = prefix.charCodeAt()

// Create a hash of a given string that is suitable for use in DOM element ID parameters.
export default function genid(str) {
	return prefix + murmurhash(str, salt)
}
