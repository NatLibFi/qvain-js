'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.doesTypeValidate = exports.getDataType = undefined;

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _is = require('./is.js');

// return the json-schema data type for a given (JSON!) value
function getDataType(thing) {
	if (thing === undefined) {
		return undefined;
	}
	if (thing === null) {
		return 'null';
	}
	//if (thing === undefined) { return 'undefined' }

	var _typeof = typeof thing === 'undefined' ? 'undefined' : _typeof2(thing);
	if (_typeof === 'string') {
		return 'string';
	}
	if (_typeof === 'object') {
		if (thing instanceof Array) return 'array';
		if (thing instanceof String) return 'string'; // JSON should only have primitive strings, but something might happen on the way
		return 'object';
	}
	if (_typeof === 'number') {
		return (0, _is.isInteger)(thing) ? 'integer' : 'number';
	}
	if (_typeof === 'boolean') {
		return 'boolean';
	}

	throw new TypeError("invalid json data type");
}

function doesTypeValidate(dataType, allowedTypes) {
	//if (schemaType.some(x => x === 'number')) { schemaType.append('integer') }
	// TODO: optimise: integer = number
	return allowedTypes === undefined || allowedTypes.some(function (x) {
		return x === dataType || x === 'number' && dataType === 'integer';
	}); // Array.prototype.includes not supported in IE
}

exports.getDataType = getDataType;
exports.doesTypeValidate = doesTypeValidate;