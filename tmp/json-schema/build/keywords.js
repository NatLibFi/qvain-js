'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports._TypeKeywords = exports._Types = undefined;

var _type_validators = require('./type_validators.js');

var SUBSCHEMA_KEYWORDS = {
	// object
	'properties': true,
	'additionalProperties': true,
	// array
	'items': true,
	'additionalItems': true
};

var _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {}
};

var _SchemaKeywords = {
	'title': {},
	'description': {},
	'default': {},
	'type': {},
	'enum': {}
};

var _DocKeywords = {
	'definitions': {
		'parser': {}
	},
	'$schema': {}
};

var _NumericTypes = {
	'keywords': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
	'validator': _type_validators.validateNumber
};

var _Types = {
	'string': {
		'keywords': ['minLength', 'maxLength', 'pattern', 'format'],
		'validator': _type_validators.validateString
	},
	'integer': _NumericTypes,
	'number': _NumericTypes,
	'object': {
		'keywords': ['properties', 'additionalProperties', 'required', 'minProperties', 'maxProperties', 'dependencies', 'patternProperties'],
		'validator': _type_validators.validateObject
	},
	'array': {
		'keywords': ['items', 'additionalItems', 'minItems', 'maxItems', 'uniqueItems'],
		'validator': _type_validators.validateArray
	},
	'boolean': {
		'keywords': [],
		'validator': _type_validators.validateBoolean
	},
	'null': {
		'keywords': [],
		'validator': _type_validators.validateNull
	}
};

function makeKeywordLookup() {
	var kws = {};

	var _loop = function _loop(type) {
		if (!_Types[type]['keywords']) return 'continue';

		_Types[type]['keywords'].forEach(function (kw) {
			return kws[kw] = type;
		});
	};

	for (var type in _Types) {
		var _ret = _loop(type);

		if (_ret === 'continue') continue;
	}
	return kws;
}

var _TypeKeywords = makeKeywordLookup();

//console.log("keywords:", _TypeKeywords)

exports._Types = _Types;
exports._TypeKeywords = _TypeKeywords;