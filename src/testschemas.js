//import schemaIow from '../schema/schema.json'
//import schemaIowDeref from '../schema/deref.json'
import schemaFairDataDeref from '../schema/qvain-fairdata-deref.json'
import schemaFairDataUI from '../schema/qvain-fairdata-ui.json'

// https://tools.ietf.org/html/draft-wright-json-schema-validation-00
// https://tools.ietf.org/html/draft-wright-json-schema-hyperschema-00

import { default as deepcopy } from 'json-deep-copy'

//var deepcopy = Object


let _testSimpleSchema = {
	'type': "string",
	'minLength': 3,
	'title': "this is the title",
}


let _testCoordinateSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"description": "A geographical coordinate",
	"type": "object",
	"properties": {
		"latitude": { "type": "number" },
		"longitude": { "type": "number" }
	}
}


let _testAgeSchema = {
	"title": "person",
	"type": "object",
	"required": ["first_name", "last_name", "age"],
	"properties": {
		"first_name": { "type": "string", "title": "first name" },
		"last_name": { "type": "string", "title": "last name" },
		"age": { "type": "integer", "minimum": 12, "maximum": 120, "multipleOf": 10 }
	}
}


let _testMultiTypeSchema = {
	"type": ["number", "string"],
	"title": "alphanum",
	"description": "this can be a number or a string",
}


let _testArrayList = {
	"type": "array",
	"items": {
		"type": "number"
	}
}


let _testArrayListMinMax = {
	"type": "array",
	"minItems": 2,
	"maxItems": 3,
	"items": {
		"type": "number"
	}
}


let _testArrayListFancy = {
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


let _testArrayTuple = {
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


let _testArrayTupleAdd = {
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


let _testTypedEnumSchema = {
	"type": "string",
	"enum": ["red", "amber", "green"]
}


let _testUntypedEnumSchema = {
	"enum": ["red", "amber", "green", null, 42]
}


let _testTypeAndEnumSchema = {
	"type": "string",
	"enum": ["red", "amber", "green", null]
}


let _testAnyOfSchema = {
	"anyOf": [
		{ "type": "string", "maxLength": 5 },
		{ "type": "number", "minimum": 0 }
	]
}


let _testAllOfSchema = {
	"allOf": [
		{ "type": "string" },
		{ "maxLength": 5 }
	]
}


let _testOneOfSchema = {
	"oneOf": [
		{ "type": "number", "multipleOf": 5 },
		{ "type": "number", "multipleOf": 3 }
	]
}


let _testOneOfSchemaObjects = {
	"oneOf": [
		{
			"type": "object",
			"title": "person",
			"properties": {
				"name": { "type": "string" },
				"age": { "type": "number" },
			},
		},
		{
			"type": "object",
			"title": "company",
			"properties": {
				"name": { "type": "string" },
				"workers": { "type": "number" },
			},
		},
	]
}


let _testDefinitionsSchema = {
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


let _testRefSchema = {
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


let _testIdSchema = {
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


let _testTabSchema = {
	"title": "tab test",
	"description": "a tab test with data for 2 tabs",
	"type": "object",
	"properties": {
		"user": deepcopy(_testAgeSchema),
		"location": deepcopy(_testCoordinateSchema),
	}
}


let _testTabSchema2 = {
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


let _testESWidget = {
	"title": "ElasticSearch test",
	"description": "ES widget refdata test",
	"type": "object",
	"properties": {
		"title": { "title": "title of publication", "type": "object" },
		"funder_type": {
			"title": "funder type",
			"description": "Project funder type from reference data",
			"type": "object",
			//"additionalProperties": false,
			"additionalProperties": {
				"type":"string"
			},
			"properties": {
				"identifier": { "title": "Identifier", "type": "string" },
				"pref_label": {
					"title": "Preferred label",
					"type": "object",
					"additionalProperties": {
						"type":"string"
					},
					//additionalProperties: false,
				},
				//"definition": { "title": "Definition", "type": "array" },
			},
		},
		"field_of_science": {
			"title": "field of science",
			"description": "Project field of science from reference data",
			"type": "object",
			//"additionalProperties": false,
			"additionalProperties": {
				"type":"string"
			},
			"properties": {
				"identifier": { "title": "Identifier", "type": "string" },
				"pref_label": {
					"title": "Preferred label",
					"type": "object",
					"additionalProperties": {
						"type":"string"
					},
					//additionalProperties: false,
				},
				//"definition": { "title": "Definition", "type": "array" },
			},
		},
	}
}


let _testTabbedArraySchema = {
	"title": "tabbed array test",
	"description": "a widget that presents arrays in a tabbed interface",
	"type": "object",
	"properties": {
		"justastring": {
			"type": "string"
		},
		"persons": {
			"type": "array",
			"items": deepcopy(_testAgeSchema)
		},
		"more_persons": {
			"type": "array",
			"items": deepcopy(_testAgeSchema)
		},
	}
}


let testSchemas = {
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
	'allof':            _testAllOfSchema,
	'oneof':            _testOneOfSchema,
	'oneofObjects':     _testOneOfSchemaObjects,
	'definitions':      _testDefinitionsSchema,
	'refs':             _testRefSchema,
	'ids':              _testIdSchema,
	'tabs':             _testTabSchema,
	'tabs2':            _testTabSchema2,
	'es':               _testESWidget,
	'tabbed_array':     _testTabbedArraySchema,
	//	'iow':              schemaIow,
	//	'iow_deref':        schemaIowDeref,
	'fairdata-deref':   schemaFairDataDeref,
	'fairdata-ui':      schemaFairDataUI,
	'fairdata-ui-tabs': schemaFairDataUI,
}

export default testSchemas
