'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Validator = exports.SchemaValidator = exports.validateSchema = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _config = require('./config.js');

var config = _interopRequireWildcard(_config);

var _is = require('./is.js');

var _keywords = require('./keywords.js');

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

var _data_validators = require('./data_validators.js');

var _type_validators = require('./type_validators.js');

var _validity = require('./validity.js');

var _jsonDeepCopy = require('json-deep-copy');

var _jsonDeepCopy2 = _interopRequireDefault(_jsonDeepCopy);

var _jsonPointer = require('json-pointer');

var _jsonPointer2 = _interopRequireDefault(_jsonPointer);

var _walk = require('./walk.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function cleanSchema(schema) {
	for (var key in schema) {
		if (_typeof(schema[key]) === 'object' && schema[key] !== null) cleanSchema(schema[key]);
	}
	delete schema[config.sentinel];
}

function countSchema(schema) {
	var foundChild = false;
	countSchema.o++;
	if (config.sentinel in schema) schema[config.sentinel]['v'] ? countSchema.t++ : countSchema.f++;
	if (config.sentinel in schema) countSchema.q++;

	for (var key in schema) {
		if (key === config.sentinel) continue;
		if (_typeof(schema[key]) === 'object' && !(schema[key] instanceof Array)) countSchema(schema[key]);
		if (_typeof(schema[key]) === 'object' && !(schema[key] instanceof Array)) foundChild = true;
	}
	if (!foundChild && !Array.isArray(schema)) {
		countSchema.v++;
	}
}

// order:
//   deref
//   check correct data type
//   validate enum
//   validate data against schema
function _validateSchema(schema, data, out, parent, path) {
	//console.log("wvh schema2:", this.schema, this.schemaCount)
	if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== 'object') throw new _error2.default("schema is not an object", path || "/");

	//console.log("schema found at path:", path || '(root)')

	//if (!_validateSchema.baseSchema) _validateSchema.baseSchema = deepcopy(schema)
	if ('$ref' in schema) {
		_validateSchema.refCount++;
		var ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1);
		console.log("ref to:", ptr);
		schema['$deref'] = schema['$ref'];
		delete schema['$ref'];
		//let ref = getPath(this.baseSchema, ptr)
		//let clone = jsonPointer.get(this.baseSchema, ptr)
		var clone = _jsonPointer2.default.get(_validateSchema.baseSchema, ptr);
		for (var key in clone) {
			schema[key] = clone[key];
		}
	}

	var dataType = (0, _data_validators.getDataType)(data);
	//var isValue = dataType !== 'object' && dataType !== 'array'
	var allowedTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type'];

	var isAnyType = !('type' in schema);
	var isValidType = isAnyType || (0, _data_validators.doesTypeValidate)(dataType, allowedTypes);

	if (!isValidType) {
		(0, _validity.addError)(schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"));
		//console.log("[FAIL] expected:", allowedTypes, "got:", dataType, "for path", path || "(root)", "schema:", schema)
		// stop checking if data type is not valid according to schema type
		//return checkValid(schema)
	}

	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")

	//if ('enum' in schema) setValid(schema, validateEnum(schema, data, out, parent, path, _validateSchema))
	if ('enum' in schema) console.log("found enum:", schema, schema['.q']);
	var enumValid = 'enum' in schema ? (0, _type_validators.validateEnum)(schema, data, out, parent, path, _validateSchema) : true;
	if ('enum' in schema) console.log("enumValid:", enumValid, data);

	//console.log("passed enum, datatype:", dataType)

	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	(0, _validity.setValid)(schema, dataType !== undefined ? enumValid && _keywords._Types[dataType].validator(schema, data, out, parent, path, _validateSchema) : false);

	// combiners run in this schema's context so will set an error that will get picked up at the end;
	// the respective schemas inside those combining keywords could be true or false though
	var combinersValid = true;
	Object.keys(_keywords._Combiners).filter(function (k) {
		return k in schema;
	}).forEach(function (kw) {
		//console.log("DEBUG:", kw)
		//if (! (kw in schema)) continue
		//console.log("DEBUG: found combiner:", kw)
		if (!_keywords._Combiners[kw].validator(schema, data, out, parent, path, _validateSchema)) {
			console.log("DEBUG: combiner failed:", kw);
			combinersValid = false;
			//addError("combiner" + kw + "failed")
		}
	});

	return (0, _validity.checkValid)(schema);
}

function makeErrorObject(schema, path) {}

/*
var Validator = {
	refCount: 0,
	schemaCount: 0,
	schemaPass: 0,
	schemaFail: 0,
	validate: _validateSchema,
	
*/

function Validator(schema, data) {
	if (!(this instanceof Validator)) throw new Error("Validator: call constructor with new");

	this.refCount = 0;
	this.schemaCount = -5;
	this.schemaPass = 0;
	this.schemaFail = 0;

	this.origSchema = schema;
	this.schema = (0, _jsonDeepCopy2.default)(schema);
	this.data = data;
	this.errors = {};
	this._validateSchema = _validateSchema;
	//this.validateObject = 
}

Validator.prototype.resetStats = function () {
	this.schemaPass = 0;
	this.schemaFail = 0;
};

Validator.prototype.validate = function () {
	console.log("schema:", this.schema);
	console.log("data:", this.data);
	return this._validateSchema(this.schema, this.data, {}, this.data, "");
};

function SchemaValidator(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema);

	//var start = new Date();
	_validateSchema.refCount = 0;
	_validateSchema.baseSchema = (0, _jsonDeepCopy2.default)(schema);
	//SchemaValidator.schema = schema

	console.log("validates:", _validateSchema(schema, data, {}, data, ""));

	//var end = new Date();
	//var millisecondsElapsed = end - start;
	//console.log("msecs:", millisecondsElapsed)

	countSchema.o = 0; // all nested objects
	countSchema.q = 0; // all q's
	countSchema.v = 0; // all values
	countSchema.t = 0; // all true q's
	countSchema.f = 0; // all false q's
	countSchema(schema);

	SchemaValidator.o = countSchema.o;
	SchemaValidator.q = countSchema.q;
	SchemaValidator.v = countSchema.v;
	SchemaValidator.t = countSchema.t;
	SchemaValidator.f = countSchema.f;

	return SchemaValidator;
}

function validateSchema(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema);

	var start = new Date();
	_validateSchema.refCount = 0;
	_validateSchema.baseSchema = (0, _jsonDeepCopy2.default)(schema);
	console.log("validates:", _validateSchema(schema, data, {}, data, ""));
	var end = new Date();
	var millisecondsElapsed = end - start;
	console.log("msecs:", millisecondsElapsed);

	console.log("errors:", schema[config.sentinel].e);
	countSchema.o = 0; // all nested objects
	countSchema.q = 0; // all q's
	countSchema.v = 0; // all values
	countSchema.t = 0; // all true q's
	countSchema.f = 0; // all false q's
	countSchema(schema);
	console.log("complete:", countSchema.t + "/" + (countSchema.t + countSchema.f), "(q:" + countSchema.q + " t:" + countSchema.t + " f:" + countSchema.f + " v:" + countSchema.v + " o:" + countSchema.o + ")");
}

exports.validateSchema = validateSchema;
exports.SchemaValidator = SchemaValidator;
exports.Validator = Validator;