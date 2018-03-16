'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validateEnum = exports.validateArray = exports.validateObject = exports.validateNull = exports.validateBoolean = exports.validateString = exports.validateNumber = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _is = require('./is.js');

var _config = require('./config.js');

var config = _interopRequireWildcard(_config);

var _validity = require('./validity.js');

var _jsonDeepCopy = require('json-deep-copy');

var _jsonDeepCopy2 = _interopRequireDefault(_jsonDeepCopy);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var STRING_FORMAT_VALIDATORS = {
	'date-time': function dateTime() {},
	'email': function email() {},
	'hostname': function hostname() {},
	'ipv4': function ipv4() {},
	'ipv6': function ipv6() {},
	'uri': function uri() {}
};

function validateString() {
	return true;
}
//function validateInteger() { return true }
function validateNumber() {
	return true;
}
function validateObject() {
	return true;
}
function validateArray() {
	return true;
}
function validateBoolean() {
	return true;
}
function validateNull() {
	return true;
}
function validateEnum() {
	return true;
}
//function validateList() { return true }

function validateString(schema, data, out, parent, path) {
	var min = schema['minLength'];
	var max = schema['maxLength'];

	if (min && max) {
		if (data.length < min || data.length > max) {
			(0, _validity.addError)(schema, "length must be between " + min + " and " + max + " characters");
		}
	} else {
		if (min && data.length < min) (0, _validity.addError)(schema, "length must be at least " + min + " characters");
		if (max && data.length > max) (0, _validity.addError)(schema, "length must be at most " + max + " characters");
	}

	// regex
	if ('pattern' in schema) {
		try {
			var re = new RegExp(schema['pattern']);
			if (!re.test(data)) (0, _validity.addError)(schema, "data doesn't match pattern");
		} catch (e) {
			// invalid regex (log?)
		}
	}

	// formats not implemented should PASS (http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.1)
	if ('format' in schema) {
		if (schema['format'] in STRING_FORMAT_VALIDATORS) {
			if (!STRING_FORMAT_VALIDATORS[schema['format']](data)) (0, _validity.addError)(schema, "invalid format for " + schema['format']);
		} else {
			// unknown format, pass (log somewhere?)
		}
	}

	/*
 schema[config.sentinel] = !errors.length
 schema[config.errormsg] = errors
 return schema[config.sentinel]
 */
	return (0, _validity.checkValid)(schema);
}

function validateNumber(schema, data, out, parent, path) {
	var opMore = function opMore(a, b) {
		return a > b;
	};
	var opMoreOrEqual = function opMoreOrEqual(a, b) {
		return a >= b;
	};
	var type = schema['type']; // number or integer
	var errors = [];

	// double-check and short-circuit to avoid doing arithmetics with something that's not a number
	if (typeof data !== 'number') {
		(0, _validity.addError)(schema, "not a number");
		return (0, _validity.checkValid)(schema);
	}

	//var min = schema['minimum']
	//var max = schema['maximum']
	//var isMinExclusive = Boolean(schema['exclusiveMinimum'])
	//var isMaxExclusive = Boolean(schema['exclusiveMaximum'])
	//var minOp = Boolean(schema['exclusiveMinimum']) ? (a, b) => a > b : (a, b) => a >= b
	if ('minimum' in schema) {
		if (!(Boolean(schema['exclusiveMinimum']) ? opMore : opMoreOrEqual)(data, schema['minimum'])) (0, _validity.addError)(schema, "number out of range (minimum)");
	}
	if ('maximum' in schema) {
		if (!(Boolean(schema['exclusiveMaximum']) ? opMore : opMoreOrEqual)(schema['maximum'], data)) (0, _validity.addError)(schema, "number out of range (maximum)");
	}

	if ('multipleOf' in schema) {
		if (data % schema['multipleOf']) {
			(0, _validity.addError)(schema, data + " is not a multiple of " + schema['multipleOf']);
		}
	}

	return (0, _validity.checkValid)(schema);
}

// Schema dependencies might change the schema conditionally; make a deepmerge copy if this is the case.
// Refer to `origSchema` for returned values (i.e. parent), and work with and pass the updated `schema` down the tree (i.e. children).
// This way the actual schema is not modified and we can test again even if the conditions (and hence the copy) change.
function validateObject(schema, data, out, parent, path, recurse) {
	//console.log("here", this.schemaCount)
	// copy ref in case we need to make a copy
	var origSchema = schema;
	var merge = require('deepmerge');

	var depProps = {};

	var _loop = function _loop(prop) {
		//schema['dependencies'][prop].forEach(dep => depProps[prop] = 'dep of ' + prop)
		//depProps[prop] = schema['dependencies'][prop].reduce(dep => { return {dep: 'dep of ' + prop} }, {})
		// schema dependency, merge schema and extra requirements into new schema copy
		if (!Array.isArray(schema['dependencies'][prop])) {
			console.log("TEST: schema dependency; merge:", prop in data);
			if (prop in data) schema = merge(schema, schema['dependencies'][prop]);
			//console.log(schema)
		} else {
			depProps[prop] = schema['dependencies'][prop].reduce(function (res, dep) {
				res[dep] = 'dep of ' + prop;return res;
			}, {});
		}
	};

	for (var prop in schema['dependencies']) {
		_loop(prop);
	}

	var addProps = schema['additionalProperties'];
	var allowAddProps = addProps !== undefined && typeof addProps === 'boolean' ? addProps : true;
	var addPropSchema = addProps !== undefined && (typeof addProps === 'undefined' ? 'undefined' : _typeof(addProps)) === 'object' ? addProps : {};

	var reqProps = schema['required'] ? schema['required'].reduce(function (res, item) {
		res[item] = true;return res;
	}, {}) : {};
	/*
 if ('dependencies' in schema) {
 	for (let prop in schema['dependencies']) {
 		schema['dependencies'][prop].forEach(dep => reqProps[dep] = 'dep of ' + prop)
 	}
 }
 */

	if ('properties' in schema) {
		var dataProps = {};
		if ((0, _is.isObject)(data)) Object.keys(data).forEach(function (k) {
			return dataProps[k] = true;
		});

		var numProps = Object.keys(dataProps).length;
		if ('minProperties' in schema && numProps < schema['minProperties']) (0, _validity.addError)(origSchema, "too few properties (got " + numProps + ", need at least " + schema['minProperties'] + ")");
		if ('maxProperties' in schema && numProps > schema['maxProperties']) (0, _validity.addError)(origSchema, "too many properties (got " + numProps + ", need at most " + schema['maxProperties'] + ")");

		for (var prop in schema['properties']) {
			// -wvh- functionality for empty data, check relevance in validation
			if (!(prop in data)) {
				// missing property
				if (config.createMissingProps) {
					data[prop] = undefined;
				} else {
					console.log("[IGNORE] unset prop:", prop);
				}
				//data[prop] = {}
			}
			if (prop in data) {
				//console.log("DEBUG:", prop)
				dataProps[prop] = false;
				if (prop in depProps) console.log("dependencies:", depProps[prop]);
				for (var dep in depProps[prop]) {
					if (!(dep in data)) (0, _validity.addError)(origSchema, "missing prop: " + dep + " (dependency of " + prop + ")");
				}
				if (!recurse(schema['properties'][prop], data[prop], out, data, path + '/' + prop)) (0, _validity.addError)(origSchema, "failed prop: " + prop);
			} else {
				//console.log("TEST:", prop, " = ", prop in reqProps)
				if (prop in reqProps) (0, _validity.addError)(origSchema, "missing prop: " + prop);
				//console.log(schema['.q'])
				//else console.log("missing prop (not required): " + prop)
			}
		}

		var restProps = Object.keys(dataProps).filter(function (k) {
			return dataProps[k];
		});
		if (restProps.length > 0) {
			//console.log("unhandled data:", restProps, addProps)
			//console.log(allowAddProps ? "... but that's fine" : "... that's strictly forbidded!")
			if (allowAddProps) {
				for (var i in restProps) {
					var _prop = restProps[i];
					//_validateSchema(schema['additionalProperties'], data[prop], out, data, path + '/' + prop)
					if (!recurse((0, _jsonDeepCopy2.default)(addPropSchema), data[_prop], out, data, path + '/' + _prop)) (0, _validity.addError)(origSchema, "failed prop: " + _prop);
				}
			} else {
				(0, _validity.addError)(origSchema, "extra properties not allowed: " + restProps.join(", "));
				console.log("[FAIL] extra props not allowed:", restProps, "[" + (path || 'root') + "]");
			}
		}
	}
	//console.log(schema['.q'])
	//console.log(origSchema['.q'])

	return (0, _validity.checkValid)(origSchema);
}

function validateArray(schema, data, out, parent, path, recurse) {
	// top caller handles type
	//if (typeof data !== 'object' || (!(data instanceof Array))) { addError(schema, "not an array") }

	// no schema restrictions, thus valid
	//if (typeof schema['items'] !== 'object') return checkValid(schema)
	if ('items' in schema && _typeof(schema['items']) !== 'object') throw new SchemaError("items (in array type) is not an object", path || "/");

	// list or tuple validation?
	var asTuple = schema['items'] instanceof Array;

	if (!asTuple) {
		// list validation
		console.log("list validation");
		//for (let i in data) {}
		for (var i in data) {
			var itemSchema = 'items' in schema ? (0, _jsonDeepCopy2.default)(schema['items']) : {};
			if (!recurse(itemSchema, data[i], out, data, path + '/' + i, recurse)) (0, _validity.addError)(schema, "list validation failed for item: " + i);
			//if (!recurse(itemSchema, data[i], out, data, path + '/' + i, recurse)) console.log("DEBUG LIST FAILED #" + i, typeof data[i])
		}
		//if (!data.every((el, i) => recurse(schema['items'], data[i], out, data, path + '/' + i, recurse))) addError(schema, "array failed list validation")
	} else {
		// tuple validation
		console.log("tuple validation");
		var allowAddItems = schema['additionalItems'] !== false;
		var addItemSchema = _typeof(schema['additionalItems']) === 'object' ? schema['additionalItems'] : {};

		if (!allowAddItems && schema['items'].length < data.length) {
			(0, _validity.addError)(schema, "additional items not allowed in array");
			//return checkValid(schema)
		}

		for (var _i in data) {
			/*
   if (typeof schema['items'][i] !== 'object') {
   	addError(schema, "[schema error] tuple validation failed for item: " + i)
   	return checkValid(schema)
   }
   */
			var _itemSchema = _i < schema['items'].length ? schema['items'][_i] : (0, _jsonDeepCopy2.default)(addItemSchema);
			if (!recurse(_itemSchema, data[_i], out, data, path + '/' + _i, recurse)) (0, _validity.addError)(schema, "tuple validation failed for index: " + _i);
		}
	}

	// minItems and maxItems
	if (typeof schema['minItems'] === 'number' && data.length < schema['minItems']) (0, _validity.addError)(schema, "too few items in array");
	if (typeof schema['maxItems'] === 'number' && data.length > schema['maxItems']) (0, _validity.addError)(schema, "too many items in array");

	// TODO: optimise (use Set or short-circuit)
	// see also: https://stackoverflow.com/questions/1960473/unique-values-in-an-array
	if (schema['uniqueItems'] === true) {
		//var unique = data.filter((v, i, a) => a.indexOf(v) === i)
		//if (data.length > unique.length) addError(schema, "array contains non-unique items")
		var shittySet = {};
		if (data.some(function (e) {
			return e in shittySet || shittySet[e]++;
		})) (0, _validity.addError)(schema, "list contains duplicates");
	}

	return (0, _validity.checkValid)(schema);
}

function validateEnum(schema, data, out, parent, path, recurse) {
	//if (typeof schema['enum'] !== 'object' || (!(schema['enum'] instanceof Array))) { addError(schema, "not an array") }
	//console.log("[pre]", schema['.q'])
	if (schema['enum'].length <= 0) {
		(0, _validity.addError)(schema, "value not in enum");
	}

	if (!schema.enum.some(function (el) {
		return (0, _deepEqual2.default)(el, data);
	})) (0, _validity.addError)(schema, "value not in enum");
	//console.log("found", data, "in enum?", schema.enum.some(el => deepequal(el, data)))
	//console.log("[post]", checkValid(schema), schema['.q'])
	return (0, _validity.checkValid)(schema);
}

function validateBoolean(schema, data, out, parent, path, recurse) {
	if (typeof data !== 'boolean') (0, _validity.addError)(schema, "not a boolean value");
	return (0, _validity.checkValid)(schema);
}

function validateNull(schema, data, out, parent, path, recurse) {
	if (!((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data === null)) (0, _validity.addError)(schema, "not null");
	return (0, _validity.checkValid)(schema);
}

exports.validateNumber = validateNumber;
exports.validateString = validateString;
exports.validateBoolean = validateBoolean;
exports.validateNull = validateNull;
exports.validateObject = validateObject;
exports.validateArray = validateArray;
exports.validateEnum = validateEnum;