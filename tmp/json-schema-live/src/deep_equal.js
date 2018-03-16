// see also:
// https://www.npmjs.com/package/deep-equal
// https://www.npmjs.com/package/deep-is

// WARNING: This is meant for json-schema data only:
//          floats != integers
// WARNING: not implemented; there seems to be some disagreement on the enum implementation in the json-schema spec,
//          like if 0 == 0.0
function deep_equal(a, b) {
	throw new Error("Not implemented")
	if (typeof a == 'number' && typeof b == 'number') {}
	
	if (a === b) return true
	
	if (!a || !b || typeof a != 'object' && typeof b != 'object') return a === b
}
