import { validateNumber, validateString, validateObject, validateArray, validateBoolean, validateNull } from './type_validators.js'

const SUBSCHEMA_KEYWORDS = {
	// object
	'properties': true,
	'additionalProperties': true,
	// array
	'items': true,
	'additionalItems': true,
}

const _Combiners = {
	'allOf': {},
	'anyOf': {},
	'oneOf': {},
	'not': {},
}

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

const _NumericTypes = {
	'keywords': ['multipleOf', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
	'validator': validateNumber,
}

const _Types = {
	'string': {
		'keywords': ['minLength', 'maxLength', 'pattern', 'format'],
		'validator': validateString,
	},
	'integer': _NumericTypes,
	'number': _NumericTypes,
	'object': {
		'keywords': ['properties', 'additionalProperties', 'required', 'minProperties', 'maxProperties', 'dependencies', 'patternProperties'],
		'validator': validateObject,
	},
	'array': {
		'keywords': ['items', 'additionalItems', 'minItems', 'maxItems', 'uniqueItems'],
		'validator': validateArray,
	},
	'boolean': {
		'keywords': [],
		'validator': validateBoolean,
	},
	'null': {
		'keywords': [],
		'validator': validateNull,
	},
}

function makeKeywordLookup() {
	var kws = {}
	for (let type in _Types) {
		if (!_Types[type]['keywords']) continue;
		
		_Types[type]['keywords'].forEach(kw => kws[kw] = type)
	}
	return kws
}

const _TypeKeywords = makeKeywordLookup()

//console.log("keywords:", _TypeKeywords)

export { _Types, _TypeKeywords }
