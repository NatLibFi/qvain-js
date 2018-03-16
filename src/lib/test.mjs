//"use strict;"
import { valueAtSchema } from './foreach_schema.mjs'

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
	"type": "object",
	"required": ["first_name", "last_name", "age"],
	"properties": {
		"first_name": {"type": "string"},
		"last_name": {"type": "string"},
		"age": {"type": "integer"}
	}
}


var testSchema = {
    "title": "tab test",
    "description": "a tab test with data for 2 tabs",
    "type": "object",
    "properties": {
        "user": _testAgeSchema,
        "location": _testCoordinateSchema,
        "pets": {
			"title": "pets",
			"type": "object",
			"properties": {
				"cat": _testAgeSchema,
				"dog": _testAgeSchema,
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


var tab = {
	'': 0,
	'/properties/user': 1,
	'/properties/location': 2,
	'/properties/pets': 3,
	'/properties/pets/properties/cat': 4,
	'/properties/phone': 5,
	'/properties/phone/properties/personal': 1,
}

valueAtSchema(testSchema, function(p) {
	console.log(p || "root", "[schema callback]", p in tab)
	return tab[p]
})
