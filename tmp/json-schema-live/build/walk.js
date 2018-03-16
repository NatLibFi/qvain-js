'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ObjectKWs = ['properties', 'definitions']; // 'additionalProperties'
var ArrayKWs = ['items', 'additionalItems'];
var _Combiners = ['oneOf', 'allOf', 'anyOf', 'not'];

function foreachSchema(schema, func) {
	_walkAndDo(schema, "", func);
}

function _walkAndDo(schema, path, func) {
	if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== 'object') throw new Error("schema is not an object: " + path || "/");

	ObjectKWs.forEach(function (kw) {
		if (kw in schema) Object.keys(schema[kw]).forEach(function (sub) {
			return _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func);
		});
	});
	if ('additionalProperties' in schema && _typeof(schema['additionalProperties']) === 'object') _walkAndDo(schema['additionalProperties'], path + "/" + 'additionalProperties', func);

	ArrayKWs.forEach(function (kw) {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				schema[kw].forEach(function (sub) {
					return _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func);
				});
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func);
			}
		}
	});
	Object.keys(_Combiners).forEach(function (kw) {
		if (kw in schema) {
			if (schema[kw] instanceof Array) {
				//console.log("diving into array", schema[kw], schema[kw][sub])
				schema[kw].forEach(function (sub, i) {
					return _walkAndDo(schema[kw][i], path + "/" + kw + "/" + i, func);
				});
			} else {
				_walkAndDo(schema[kw], path + "/" + kw, func);
			}
		}
	});

	//Object.keys(_Combiners).forEach(kw => { if (kw in schema) schema[kw].forEach(sub => _walkAndDo(schema[kw][sub], path + "/" + kw + "/" + sub, func) })

	func(path, schema);
}

exports.foreachSchema = foreachSchema;