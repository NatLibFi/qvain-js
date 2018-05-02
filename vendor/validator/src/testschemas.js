//import schemaIow from '../schema/schema.json'
//import schemaIowDeref from '../schema/deref.json'

// https://tools.ietf.org/html/draft-wright-json-schema-validation-00
// https://tools.ietf.org/html/draft-wright-json-schema-hyperschema-00

import { default as deepcopy } from 'json-deep-copy'

//var deepcopy = Object


var _testSimpleSchema = {
	'type': "string",
	'minLength': 3,
	'title': "this is the title",
}


var _testCoordinateSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"description": "A geographical coordinate",
	"type": "object",
	"properties": {
		"latitude": { "type": "number" },
		"longitude": { "type": "number" }
	}
}


var _testAgeSchema = {
	"title": "person",
	"type": "object",
	"required": ["first_name", "last_name", "age"],
	"properties": {
		"first_name": { "type": "string", "title": "first name" },
		"last_name": { "type": "string", "title": "last name" },
		"age": { "type": "integer", "minimum": 12, "maximum": 120, "multipleOf": 10 }
	}
}


var _testMultiTypeSchema = {
	"type": ["number", "string"],
	"title": "alphanum",
	"description": "this can be a number or a string",
}


var _testArrayList = {
	"type": "array",
	"items": {
		"type": "number"
	}
}


var _testArrayListMinMax = {
	"type": "array",
	"minItems": 2,
	"maxItems": 3,
	"items": {
		"type": "number"
	}
}


var _testArrayListFancy = {
	"type": "array",
	"minItems": 2,
	"maxItems": 5,
	"title": "favourite numbers",
	"description": "A list of my favourite multiples of 5",
	"items": {
		"type": "number",
		"title": "favourite",
		"multipleOf": 5
	}
}


var _testArrayTuple = {
	"type": "array",
	"items": [
		{
			"type": "number"
		},
		{
			"type": "string"
		},
		{
			"type": "string",
			"enum": ["Street", "Avenue", "Boulevard"]
		},
		{
			"type": "string",
			"enum": ["NW", "NE", "SW", "SE"]
		}
	]
}


var _testArrayTupleAdd = {
	"type": "array",
	"items": [
	{
		"type": "number"
	},
	{
		"type": "string"
	},
	{
		"type": "string",
		"enum": ["Street", "Avenue", "Boulevard"]
	},
	{
		"type": "string",
		"enum": ["NW", "NE", "SW", "SE"]
	}
	],
	"additionalItems": false
}


var _testTypedEnumSchema = {
	"type": "string",
	"enum": ["red", "amber", "green"]
}


var _testUntypedEnumSchema = {
	"enum": ["red", "amber", "green", null, 42]
}


var _testTypeAndEnumSchema = {
	"type": "string",
	"enum": ["red", "amber", "green", null]
}


var _testAnyOfSchema = {
	"anyOf": [
	{ "type": "string", "maxLength": 5 },
	{ "type": "number", "minimum": 0 }
	]
}


var _testOneOfSchema = {
	"oneOf": [
	{ "type": "number", "multipleOf": 5 },
	{ "type": "number", "multipleOf": 3 }
	]
}


var _testDefinitionsSchema = {
	"definitions": {
		"address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city":           { "type": "string" },
				"state":          { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		}
	}
}


var _testRefSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	
	"definitions": {
		"address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city":           { "type": "string" },
				"state":          { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		}
	},
	
	"type": "object",
	
	"properties": {
		"billing_address": { "$ref": "#/definitions/address" },
		"shipping_address": { "$ref": "#/definitions/address" }
	}
}


var _testIdSchema = {
	"$id": "http://example.com/root.json",
	"definitions": {
		"A": { "$id": "#foo" },
		"B": {
			"$id": "other.json",
			"definitions": {
				"X": { "$id": "#bar" },
				"Y": { "$id": "t/inner.json" }
			}
		},
		"C": {
			"$id": "urn:uuid:ee564b8a-7a87-4125-8c96-e9f123d6766f"
		}
	}
}


var _testTabSchema = {
    "title": "tab test",
    "description": "a tab test with data for 2 tabs",
    "type": "object",
    "properties": {
        "user": deepcopy(_testAgeSchema),
        "location": deepcopy(_testCoordinateSchema),
    }
}


var _testTabSchema2 = {
	"title": "tab test",
	"description": "a tab test with data for 2 tabs",
	"type": "object",
	"properties": {
		"user": deepcopy(_testAgeSchema),
		"location": deepcopy(_testCoordinateSchema),
		"pets": {
			"title": "pets",
			"type": "object",
			"properties": {
				"cat": deepcopy(_testAgeSchema),
				"dog": deepcopy(_testAgeSchema),
			},
		},
		"phone": {
			"title": "phone numbers",
			"type": "object",
			"properties": {
				"personal": { "title": "personal phone", "type": "number" },
				"work": { "title": "work phone", "type": "number" },
			},
		},
		"extra": { "title": "some extra information", "type": "string" },
	}
}



var testSchemas = {
	'simple':           _testSimpleSchema,
	'coordinate':       _testCoordinateSchema,
	'age':              _testAgeSchema,
	'multitype':        _testMultiTypeSchema,
	'arraylist':        _testArrayList,
	'arraylist_minmax': _testArrayListMinMax,
	'arraylist_fancy':  _testArrayListFancy,
	'arraytuple':       _testArrayTuple,
	'arraytuple_add':   _testArrayTupleAdd,
	'typed_enum':       _testTypedEnumSchema,
	'untyped_enum':     _testUntypedEnumSchema,
	'type_and_enum':    _testTypeAndEnumSchema,
	'anyof':            _testAnyOfSchema,
	'oneof':            _testOneOfSchema,
	'definitions':      _testDefinitionsSchema,
	'refs':             _testRefSchema,
	'ids':              _testIdSchema,
    'tabs':             _testTabSchema,
	'tabs2':            _testTabSchema2,
//	'iow':              schemaIow,
//	'iow_deref':        schemaIowDeref,
	
}

export default testSchemas
