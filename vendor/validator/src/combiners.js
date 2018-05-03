import * as config from './config.js'
//import { checkValid, addError } from './validity.js'
import SchemaError from './error.js'

function validateAnyOf(schema, data, path, parent, prop, recurse) {
	if (! (schema['anyOf'] instanceof Array)) throw new SchemaError("anyOf is not an array", path || "/")
	
	//recurse()
	if (! schema.anyOf.some((sub, i) => recurse(sub, data, path + "/anyOf/" + i, schema, i, recurse))) this.addError(schema, "anyOf-combiner failed")

	return this.checkValid(schema)
}


function validateAllOf(schema, data, path, parent, prop, recurse) {
	if (! (schema['allOf'] instanceof Array)) throw new SchemaError("allOf is not an array", path || "/")

	if (! schema.allOf.every((sub, i) => recurse(sub, data, path + "/allOf/" + i, schema, i, recurse))) this.addError(schema, "allOf-combiner failed")
		
	return this.checkValid(schema)
}		


function validateOneOf(schema, data, path, parent, prop, recurse) {
	if (! (schema['oneOf'] instanceof Array)) throw new SchemaError("oneOf is not an array", path || "/")
	
	if (schema.oneOf.filter((sub, i) => recurse(sub, data, path + "/oneOf/" + i, schema, i, recurse)).length != 1) this.addError(schema, "oneOf-combiner failed")
		
	return this.checkValid(schema)
}


function validateNot(schema, data, path, parent, prop, recurse) {
	if (schema['not'] !== 'object') throw new SchemaError("not-combiner is not a schema object", path || "/")
	
	if (! recurse(schema.not, data, path + "/not", schema, 'not', recurse)) this.addError(schema, "not-combiner failed")
		
	return this.checkValid(schema)
}

export { validateAnyOf, validateAllOf, validateOneOf, validateNot }
