// pruneEmpty removes empty branches and leaves
export const pruneEmpty = (obj) => {
	Object.keys(obj).forEach(key => {
		// object or array, recurse first
		if (obj[key] && typeof obj[key] === 'object') {
			pruneEmpty(obj[key])
			if (Object.keys(obj[key]).length === 0) delete obj[key]
			if (Array.isArray(obj[key]) && obj[key].length === 0) delete obj[key]
		}
		// ordinary value, check if undefined; delete only if not in array
		else if (obj[key] === undefined && !Array.isArray(obj)) delete obj[key]
	})
}
