import * as config from './config.js'
import { checkValid, addError } from './validity.js'
import SchemaError from './error.js'

function validateAnyOf(schema, data, out, parent, path, recurse) {
	if (! (schema['anyOf'] instanceof Array)) throw new SchemaError("anyOf is not an array", path || "/")
		
	//recurse()
	if (! schema.anyOf.some((sub, i) => recurse(sub, data, out, schema, path + "/anyOf/" + i, recurse))) addError(schema, "anyOf-combiner failed")
	
	return checkValid(schema)
}


function validateAllOf(schema, data, out, parent, path, recurse) {
	if (! (schema['allOf'] instanceof Array)) throw new SchemaError("allOf is not an array", path || "/")
		
	if (! schema.allOf.every((sub, i) => recurse(sub, data, out, schema, path + "/allOf/" + i, recurse))) addError(schema, "allOf-combiner failed")
		
	return checkValid(schema)
}		


function validateOneOf(schema, data, out, parent, path, recurse) {
	if (! (schema['oneOf'] instanceof Array)) throw new SchemaError("oneOf is not an array", path || "/")
	
	if (schema.oneOf.filter((sub, i) => recurse(sub, data, out, schema, path + "/oneOf/" + i, recurse)).length != 1) addError(schema, "oneOf-combiner failed")
		
	return checkValid(schema)
}


function validateNot(schema, data, out, parent, path, recurse) {
	if (schema['not'] !== 'object') throw new SchemaError("not-combiner is not a schema object", path || "/")
	
	if (! recurse(schema.not, data, out, schema, path + "/not", recurse)) addError(schema, "not-combiner failed")
		
	return checkValid(schema)
}
		

export { validateAnyOf, validateAllOf, validateOneOf, validateNot }
