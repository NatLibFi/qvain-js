// Makes a deep copy from an object
// NOTE: uses Array.isArray()
// @param {Object} src - nested object
// @return {Object} - copied object without hard references
// @see {@link https://github.com/zxdong262/deep-copy}
// @see {@link http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript}
export function deepCopy(src) {
	if (src === null || typeof(src) !== 'object'){
		return src
	}
	if (Array.isArray(src)) {
		let ret = src.slice()
		let i = ret.length
		while (i--) {
			ret[i] = deepCopy(ret[i])
		}
		return ret
	}
	let dest = {}
	for (let key in src) {
		dest[key] = deepCopy(src[key])
	}
	return dest
}
