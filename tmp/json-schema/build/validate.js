'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validateSchema = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _config = require('./config.js');

var config = _interopRequireWildcard(_config);

var _is = require('./is.js');

var _keywords = require('./keywords.js');

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

var _data_validators = require('./data_validators.js');

var _validity = require('./validity.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function cleanSchema(schema) {
	for (var key in schema) {
		if (_typeof(schema[key]) === 'object') cleanSchema(schema[key]);
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
		if (_typeof(schema[key]) === 'object') countSchema(schema[key]);
		if (_typeof(schema[key]) === 'object') foundChild = true;
	}
	if (!foundChild && !Array.isArray(schema)) {
		countSchema.v++;
	}
}

function _validateSchema(schema, data, out, parent, path) {
	if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== 'object') throw new _error2.default("schema is not an object", path || "/");

	var dataType = (0, _data_validators.getDataType)(data);
	var isValue = dataType !== 'object' && dataType !== 'array';
	var allowedTypes = typeof schema['type'] === 'string' ? [schema['type']] : schema['type'];

	var isAnyType = !('type' in schema);
	var isValidType = isAnyType || (0, _data_validators.doesTypeValidate)(dataType, allowedTypes);

	if (!isValidType) {
		(0, _validity.addError)(schema, "invalid data type" + "(got: " + dataType + ", wanted: " + (allowedTypes.join(", ") || "any"));
		console.log("[FAIL] expected:", allowedTypes, "got:", dataType, "for path", path, "schema:", schema);
		// stop checking if data type is not valid according to schema type
		return (0, _validity.checkValid)(schema);
	}

	//console.log(path || '/', "datatype:", dataType, "; schematype:", allowedTypes || "any", "; type validates:", isValidType, isValue ? "; data: " + data: "")

	// data type is valid against the types in the schema or there were no types in the schema;
	// call the validators for the data type
	(0, _validity.setValid)(schema, dataType !== undefined ? _keywords._Types[dataType].validator(schema, data, out, parent, path, _validateSchema) : false);

	return (0, _validity.checkValid)(schema);
}

function validateSchema(schema, data) {
	if (config.sentinel in schema) cleanSchema(schema);
	console.log("validates:", _validateSchema(schema, data, {}, data, ""));
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