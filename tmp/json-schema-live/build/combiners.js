'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validateNot = exports.validateOneOf = exports.validateAllOf = exports.validateAnyOf = undefined;

var _config = require('./config.js');

var config = _interopRequireWildcard(_config);

var _validity = require('./validity.js');

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function validateAnyOf(schema, data, out, parent, path, recurse) {
	if (!(schema['anyOf'] instanceof Array)) throw new _error2.default("anyOf is not an array", path || "/");

	//recurse()
	if (!schema.anyOf.some(function (sub, i) {
		return recurse(sub, data, out, schema, path + "/anyOf/" + i, recurse);
	})) (0, _validity.addError)(schema, "anyOf-combiner failed");

	return (0, _validity.checkValid)(schema);
}

function validateAllOf(schema, data, out, parent, path, recurse) {
	if (!(schema['allOf'] instanceof Array)) throw new _error2.default("allOf is not an array", path || "/");

	if (!schema.allOf.every(function (sub, i) {
		return recurse(sub, data, out, schema, path + "/allOf/" + i, recurse);
	})) (0, _validity.addError)(schema, "allOf-combiner failed");

	return (0, _validity.checkValid)(schema);
}

function validateOneOf(schema, data, out, parent, path, recurse) {
	if (!(schema['oneOf'] instanceof Array)) throw new _error2.default("oneOf is not an array", path || "/");

	if (schema.oneOf.filter(function (sub, i) {
		return recurse(sub, data, out, schema, path + "/oneOf/" + i, recurse);
	}).length != 1) (0, _validity.addError)(schema, "oneOf-combiner failed");

	return (0, _validity.checkValid)(schema);
}

function validateNot(schema, data, out, parent, path, recurse) {
	if (schema['not'] !== 'object') throw new _error2.default("not-combiner is not a schema object", path || "/");

	if (!recurse(schema.not, data, out, schema, path + "/not", recurse)) (0, _validity.addError)(schema, "not-combiner failed");

	return (0, _validity.checkValid)(schema);
}

exports.validateAnyOf = validateAnyOf;
exports.validateAllOf = validateAllOf;
exports.validateOneOf = validateOneOf;
exports.validateNot = validateNot;