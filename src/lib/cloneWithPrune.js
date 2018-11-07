/*
	Make a deep clone of an object, pruning empty branches and leaves. Only supports JSON primitive types.

	Loosely based on deepCopy:

	https://www.npmjs.com/package/json-deep-copy
	https://github.com/zxdong262/deep-copy
	https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
*/
export default function cloneWithPrune(src) {
	if (src == null || typeof src !== 'object') return src

	if (Array.isArray(src)) {
	// use filter() here if you want to remove undefined array items
		let ret = src.slice()
		let i = ret.length
		while (i--) {
			ret[i] = cloneWithPrune(ret[i])
		}
		return ret
	}

	let dest = {}
	for (let key in src) {
		if (src[key] === undefined) continue

		if (src[key] && typeof src[key] === 'object') {
		//if (Array.isArray(src[key]) && src[key].length === 0) continue
		//else if (Object.keys(src[key]).length === 0) continue

			let maybe = cloneWithPrune(src[key])
			if (Array.isArray(maybe) && maybe.length === 0) continue
			else if (Object.keys(maybe).length === 0) continue

			dest[key] = maybe
		} else {
			dest[key] = src[key]
		}
	}

	return dest
}
