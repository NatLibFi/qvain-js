//import set from 'core-js/es6/set'
//import url from 'url'
//import objectAssign from 'object-assign' // Object.assign "ponyfill"
//import URL from 'url' // node core URL module because WHATWG API is probably not implemented in browsers yet
//import URL from 'url-parse'

//import URI from './uris/uris.js'
var URI = require('../../vendor/uris/uris.js')

// URN:
//   https://github.com/goulash1971/urn-parser
//   https://github.com/webr3/URI

// -wvh- ponyfills:
//
// list:
//   https://www.npmjs.com/browse/keyword/ponyfill
//
// https://www.npmjs.com/package/object-assign
// https://www.npmjs.com/package/array-find
//
// url parsing:
// https://www.npmjs.com/package/url-parse-lax

/*
import RefParser from 'json-schema-ref-parser'
*/

//const TYPES = new Set(['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'])

// group integer and number types because they have the same keywords
const _NumericTypes = {
	'keywords': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
}

/*
 * types
 * -----
 * string
 *   length: minLength, maxLength
 *   pattern (ECMA 262)
 *   format (optional): date-time, email, hostname, ipv4, ipv6, uri
 * 
 * numeric (both integer/number)
 *   multipleOf
 *   range: minimum, maximum, exclusiveMinimum, exclusiveMaximum
 * 
 * object
 *   properties: keys and their types
 *   additionalProperties: boolean|object
 *     boolean: allowed or not (default true)
 *     object: schema
 *   required: array
 *   size: minProperties, maxProperties
 *   dependencies
 *     property: object where key refers to a property and value to an array of
 *     schema: object where key refers to a property and value to an object which is also a schema
 *   patternProperties: allow only additional properties if their key matches a pattern; takes precedence over additionalProperties
 * 
 * array
 *   list validation
 *     items: object with schema to be applied to each item
 *     additionalItems: ignore
 *   tuple validation
 *     items: array with schema objects
 *     additionalItems: allowed or not (default true)
 *   length: minItems, maxItems
 *   uniqueItems: boolean
 * 
 * boolean
 * 
 * null
 * 
 */
const _Types = {
	'string': {
		'keywords': ['minLength', 'maxLength', 'pattern', 'format'],
	},
	'integer': _NumericTypes,
	'number': _NumericTypes,
	'object': {
		'keywords': ['properties', 'additionalProperties', 'required', 'minProperties', 'maxProperties', 'dependencies', 'patternProperties'],
	},
	'array': {
		'keywords': ['items', 'additionalItems', 'minItems', 'maxItems', 'uniqueItems'],
	},
	'boolean': {},
	'null': {},
}

/*
 * combiners
 * 
 * anyOf
 * allOf
 * oneOf (exclusive)
 * not
 * 
 */
const _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {},
}

/*
 * keywords
 * 
 * title (string)
 * description (string)
 * default (validating default value)
 * 
 * enum
 *   - array with at least one element
 *   - elements unique
 *   - type takes precedence if defined
 * 
 */
const _SchemaKeywords = {
	'title': {},
	'description': {},
	'default': {},
	'type': {},
	'enum': {},
}

const _DocKeywords = {
	'definitions': {
		'parser': {},
	},
	'$schema': {},
}

function getType(schema) {
	return schema['type']
}

function isValidType(type) {
	//return TYPES.has(type)
	return type in _Types
}

/*
function isCombiner(thing) {
	return thing in _Combiners
}
*/

function isCombiningSchema(schema) {
	// no support for Array.prototype.includes in IE
	//return Object.keys(schema).some(isCombiner)
	return Object.keys(schema).some(x => x in _Combiners)
}

function getCombiner(schema) {
	// no support for Array.prototype.find in IE
	for (let combiner in _Combiners) {
		if (combiner in schema) {
			return combiner
		}
	}
	return undefined
}

function isObject(thing) {
	return thing !== null && typeof thing === 'object' && !(thing instanceof String || thing instanceof Array || typeof thing === 'function')
}

function isArray(thing) {
	return thing instanceof Array
}

/*
function isInteger (nVal) {
	return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
}
*/

var isNumber = function(val) {
	return typeof val === 'number'
}

var isFinite = Number.isFinite || function(val) {
	return typeof val === 'number' && isFinite(val)
}

var isInteger = Number.isInteger || function(val) {
	return typeof val === "number" &&
	isFinite(val) &&
	Math.floor(val) === val
}

var isString = function(val) {
	return typeof val === 'string' || val instanceof String
}

var isNull = function(val) {
	return val === null
}

var isBoolean = function(val) {
	return typeof val === 'boolean'
}


// convert JSON value to schema type (string, integer, number, boolean, null)
function valueToType(val) {
	if (isNull(val)) {
		return 'null'
	} else if (isNumber(val)) {
		return isInteger(val) ? 'integer' : 'number'
	} else if (isString(val)) {
		return 'string'
	} else if (isBoolean(val)) {
		return 'boolean'
	} else {
		//throw new TypeError("valueToType(): not a valid schema value type")
		//throw new SchemaError("valueToType(): not a valid schema value type: " + (typeof val))
		// don't throw here; throw in the parsing code so we can add the path
		return undefined
	}
}


// not <=IE8
function member(arr, item) {
	return (arr.indexOf(item) != -1)
}






// implement custom errors, so we can separate our own from Javascript's in try/catch handling
function SchemaError(message, path) {
	this.name = 'SchemaError'
	this.message = message || "unspecified error"
	this.path = path || ''
	this.stack = (new Error()).stack
}
SchemaError.prototype = Object.create(Error.prototype)
SchemaError.prototype.constructor = SchemaError






// implement context
function ContextObject(p, id) {
	this.p = p || ""
	this.id = id || ""
}
//ContextObject.prototype.constructor = ContextObject
ContextObject.prototype.withP = function(newP) {
	//this.p = newP
	//return this
	//return objectAssign({p: newP}, this)
	//return objectAssign({}, this, {p: newP})
	//return {id: this.id, p: newP}
	return new ContextObject(newP, this.id)
}




function SchemaParser(doc, logger) {
	this.document = doc
	this.log = logger || function() {}
	
	this.definition = {}
	this.definitions = {}
	this.refs = {}
	this.uris = {}
	this.root = {}
	this.baseUri = ""
	this.errors = new Array()
}


SchemaParser.prototype.logError = function(msg, path) {
	this.errors.push({msg: msg, path: path, type: 'error'})
}


SchemaParser.prototype.logWarning = function(msg, path) {
	this.errors.push({msg: msg, path: path, type: 'warning'})
}



SchemaParser.prototype.parseDoc = function() {
	if (!isObject(this.document)) {
		//throw "top-level not an object"
		throw new SchemaError("top-level not an object")
	}
	
	if ('definitions' in this.document) {
		this.parseDefinitions('#/definitions', this.document['definitions'])
	}

	this.parse('#', this.document)
}


SchemaParser.prototype.parse = function(path, schema, isFirstPass) {
	let log = this.log
	let isDocLevel = path.length === 1 // #: toplevel
	
	if (!isObject(schema)) {
		//throw "not an object"
		throw new SchemaError("schema not an object")
	}
	
	// object; append path
	//path = path + "/"
	
	// empty schema: PASS
	if (Object.keys(schema).length === 0) {
		log("pass")
		return
	}
	
	// before we iterate over the schema's keys, we need to know the type and if it's a combiner (which should be mutually exclusive)
	let type = getType(schema)
	let realType = type
	let combiner = getCombiner(schema)
	if (isCombiningSchema(schema)) {
		log("combining schema! " + getCombiner(schema))
	}
	
	if (type === undefined) {
		/*
		log("pass")
		return
		*/
		log(path + " no type specified for schema " + (combiner ? "(but is combiner)" : "(faking object for now) [WARNING]"))
		if (!combiner) { this.logWarning("no type for schema", path) }
		// no type means no type validation
		// FIXME: IOW schema is missing some type declarations; fake object for now so we can get on with coding
		type = 'object'
	}
	if (!isValidType(type)) {
		//throw "not a valid type:" + type
		throw new SchemaError("not a valid schema type: " + type)
	}
	
	log(path + " <schema type:" + type + ">")
	
	let kws = _Types[type]['keywords']
	
	//log("valid keywords:" + kws)
	
	for (let key in schema) {
		let newpath = path + '/' + key
		//let newpath = path + key
		
		if (key === 'type') {
			// skip, pre-parsed
			log(newpath + " found valid keyword: type")
			continue
		}
		
		if (member(kws, key)) {
			log(newpath + " found valid type keyword: " + key)
			if (key === "required") { this.parseRequired(newpath, schema['required']) }
			if (key === "properties") { this.parseProperties(newpath, schema['properties']) }
		} else if (key in _SchemaKeywords) {
			if (key === "enum") { this.parseEnum(newpath, schema['enum'], realType) }
			log(newpath + " found schema keyword: " + key)
		} else if (key in _DocKeywords) {
			if (!isDocLevel) {
				log(newpath + " found top level keyword in middle of tree [ERROR]")
				continue
			}
			log(newpath + " found toplevel keyword: " + key)
			if ('parser' in _DocKeywords[key]) { /* empty */ }
			//if (key === "definitions") { this.parseDefinitions(newpath, schema['definitions']) }
		} else if (key in _Combiners) {
			log(newpath + " skipping combiner: " + key)
		} else {
			if (key === "@id" || key === "@type") {
				log(newpath + " skipping non-keyword: " + key)
				continue
			}
			if (key === "$ref") {
				log(newpath + " found JSON pointer: " + schema[key] + (isFirstPass ? "(not resolving)" : ""))
				if (!isFirstPass) {
					this.parseRef(newpath, schema[key])
				}
				continue
			}
			
			log(newpath + " found unknown keyword for type " + type + ": " + key)
		}
	}
}


SchemaParser.prototype.parseRequired = function(path, reqs) {
	let log = this.log
	
	if (!isArray(reqs)) {
		//throw "parseRequired(): not an array at " + path
		throw new SchemaError("parseRequired(): `required` is not an array at " + path)
	}
	
	/*
	reqs.forEach((v, i) => log(path + '/' + i + " <`" + v + "`>"))

	let reqSet = reqs.reduce(function(res, req) {
		if (!isString(req)) { throw new SchemaError("parseRequired(): array contains non-string value at " + path) }
		res[req] = true;
		return res;
	}, {})
	*/
	
	let reqSet = {}
	reqs.forEach((req, i) => {
		if (!isString(req)) { throw new SchemaError("parseRequired(): array contains non-string value at " + path + '/' + i) }
		log(path + '/' + i + " <`" + req + "`>")
		reqSet[req] = true
	})
		
	
	log(path + " <set: {" + Object.keys(reqSet) + "}>")
}


SchemaParser.prototype.parseDefinitions = function(path, defs) {
	let log = this.log
	
	if (!isObject(defs)) {
		throw new SchemaError("parseDefinitions(): `definitions` is not an object at " + path)
	}
	
	//path = path + '/'
	
	for (let def in defs) {
		let newpath = path + '/' + def
		
		//this.definition[def] = {}
		this.definition[newpath] = defs[def]
		
		log(newpath + " <definition>")

		this.parse(newpath, defs[def])
	}
}


SchemaParser.prototype.parseProperties = function(path, props) {

	let log = this.log
	
	if (!isObject(props)) {
		throw new SchemaError("parseProperties(): `properties` is not an object at " + path)
	}
	
	path = path + '/'
	
	for (let prop in props) {
		let newpath = path + prop
		
		log(newpath + " <property>")
		
		this.parse(newpath, props[prop])
	}
}


SchemaParser.prototype.parseEnum = function(path, arr, type) {
	let log = this.log
	
	if (!isArray(arr)) {
		throw new SchemaError("parseEnum(): `enum` is not an array at " + path)
	}
	
	log(path + " <enum type:" + (type !== undefined ? type : "any") + ">")
	path = path + '/'
	
	arr.forEach(function(x, i) {
		log(path + i + " <`" + x + "` type:" + valueToType(x) + ">")
	})
	
	// if we have a type, check first if array elements themselves validate
	// NOTE: apparently this isn't necessary; first validate enum, then type, then decide
	/*
	if (type !== undefined && !arr.every(x => valueToType(x) === type)) {
		throw new SchemaError("parseEnum(): `enum` itself doesn't validate with schema type at " + path)
	}
	*/
	
	let enumWithType = arr.map(function(val, i) {
		let valType = valueToType(val)
		if (valType === undefined) {
			throw new SchemaError("parseEnum(): value of unknown type at index position " + i + " at " + path + i)
		}
		return {
			'value': val,
			'type': valType,
		}
	})
	
	log(path + " " + enumWithType)

	/*
	arr.reduce(function(res, item) {
		res[item] = {item };
		return res;
	}, {})
	*/
}


SchemaParser.prototype.parseRef = function(path, ref) {
	let log = this.log
	
	//let i = ref.indexOf('#')
	if (ref.indexOf('#') > 0) {
		log(path + " <ref:" + ref + "> refers to another document; this is unsupported [WARNING]")
		this.logError("ref points to non-local document (unsupported)", path)
		return
	}
	
	if (ref in this.definition) {
		log(path + " <ref:" + ref + "> resolved")
	} else {
		log(path + " <ref:" + ref + "> not found! [WARNING]")
		this.logError("ref not found: " + ref, path)
	}
}



/*
SchemaParser.prototype.Dereference = function(schema) {
	RefParser.dereference(schema, {
		parse: {
			json: true,
			yaml: false,
			text: false,
			binary: false,
		},
		resolve: {
			file: false,
			http: false,
		},
		dereference: {
			circular: false
		}
	})
	
}
*/

/* -wvh- beyond this line, not implemented yet */


SchemaParser.prototype.parseId = function(context, id) {
	console.log(context, id)
}


SchemaParser.prototype._Dereference = function(schema) {
	let context = { ptr: "/", id: "#" }
	this.refWalk(context, schema)
}


SchemaParser.prototype.walkSchema = function(schema, func, p) {
	//if (!this.path) { this.path = '/' }
	
	//func(this.path || '/')
	if (!p) { p = '' }
	
	for (var i in schema) {
		let np = p + '/' + i
		//p = p + '/' + i
		//func.apply(this, [i, schema[i]]);
		//func(this.path || '/')
		func(np)
		
		if (schema[i] !== null && typeof(schema[i]) == "object") {
			//this.path += '/' + (this.path ? i : '')
			//this.path = (this.path || '') + '/' + i
			this.walkSchema(schema[i], func, np)
		}
	}
}


SchemaParser.prototype.walkWithContext = function(schema, func) {
	//var ctx = { p: "", id: "#" }
	var ctx = new ContextObject()
	if (typeof schema != "object") {
		throw new SchemaError("top-level not an object")
	}
	
	this._ctxWalk(schema, func, ctx)
}

SchemaParser.prototype._ctxWalk = function(schema, func, ctx) {
	for (var i in schema) {
		let np = ctx.p + '/' + i
		func(np)
		//if (i === '$ref') { this.refs}

		if (i === '$id') { this._addId(schema[i], ctx); func("added $id: " + schema[i] + " --> " + ctx.p, this.uris) }
		
		if (schema[i] !== null && typeof schema[i] == "object") {
			//this._ctxWalk(schema[i], func, objectAssign(ctx, {p: np}));
			this._ctxWalk(schema[i], func, ctx.withP(np))
			//this._ctxWalk(schema[i], func, {p: np, id: ctx.id});
		}
	}
}


// http://json-schema.org/latest/json-schema-core.html#id-keyword
SchemaParser.prototype._addId = function(id, ctx) {
	var parent = ctx.p || "/"
	if (typeof id !== 'string') { throw new SchemaError("_addId(): $id is not a string", parent) }
	if (id === "" || id === "#") { throw new SchemaError("_addId(): $id can't be empty or hash", parent) }

	// URI, URL and URN
	//   https://tools.ietf.org/html/rfc3986#section-1.1.2)
	// Syntax components
	//   https://tools.ietf.org/html/rfc3986#section-1.1.2
	
	if (id in this.uris) { throw new SchemaError("_addId(): duplicate $id", parent) }
	
	// document-local fragment: #[A-Za-z][A-Za-z0-9:._-]
	// otherwise, resolve against base
	var uri = new URI(id)
	
	if (uri.scheme() === 'urn:') { /* empty */ }
	
	if (parent === "/") {
		// TODO: check if no or zero-length fragment
		// base uri
		if (!uri.isAbsolute()) {
			throw new SchemaError("_addId(): base uri is not absolute")
		}
		
		this.baseUri = id
		this.log("baseuri = " + id)
		this._baseuri = new URI(id)
	}
	
	
	this.uris[id] = {'p': parent, 'ref': this._baseuri.resolveReference(id)}
}


// refs
SchemaParser.prototype._addRef = function(id, ctx) {
	console.log(id, ctx)
}



SchemaParser.prototype.refWalk = function(context, schema) {
	if (!isObject(this.document)) {
		throw new SchemaError("refWalk(): schema not an object")
	}
	
	// $ref, $id
	if ('$id' in schema) { /* empty */ }
}


export { SchemaParser as default, _Types as SchemaTypes }
