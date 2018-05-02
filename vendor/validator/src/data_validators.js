import { isInteger } from './is.js'

// return the json-schema data type for a given (JSON!) value
function getDataType(thing) {
	if (thing === undefined) { return undefined }
	if (thing === null) { return 'null' }
	//if (thing === undefined) { return 'undefined' }
	
	var _typeof = typeof thing
	if (_typeof === 'string') { return 'string' }
	if (_typeof === 'object') {
		if (thing instanceof Array) return 'array'
		if (thing instanceof String) return 'string' // JSON should only have primitive strings, but something might happen on the way
		return 'object'
	}
	if (_typeof === 'number') { return isInteger(thing) ? 'integer' : 'number' }
	if (_typeof === 'boolean') { return 'boolean' }
	
	throw new TypeError("invalid json data type")
}


function doesTypeValidate(dataType, allowedTypes) {
	//if (schemaType.some(x => x === 'number')) { schemaType.append('integer') }
	// TODO: optimise: integer = number
	return allowedTypes === undefined || allowedTypes.some(x => x === dataType || x === 'number' && dataType === 'integer') // Array.prototype.includes not supported in IE
}


export { getDataType, doesTypeValidate }
