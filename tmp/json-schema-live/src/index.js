"use strict";

import { validateSchema } from './validate.js'


var testdataGood = { "latitude": 123, "longitude": 666 }
var testdataBad = { "latitude": 123, "extra": "extradata" }

var testschema = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } } }
var testschemaNoAdd = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } }, "additionalProperties": false }

var testStringData = "HELLO"
var testStringSchema = { "type": "string" }

var testNumberSchema = {
	"type": "number",
	"minimum": 0,
	"maximum": 100,
	"exclusiveMaximum": true,
	"multipleOf": 5,
}

//import schemaIowDeref from '../../../schema/deref.json'
import schemaIow from '../../../schema/schema.json'

var testAddressRef = {
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
		"shipping_address": {
			"allOf": [
				{ "$ref": "#/definitions/address" },
				{ "properties":
					{ "type": { "enum": [ "residential", "business" ] } },
					"required": ["type"]
				}
			]
		}
	}
}

var testRequiredProps = {
	"type": "object",
	"properties": {
		"name":      { "type": "string" },
		"email":     { "type": "string" },
		"address":   { "type": "string" },
		"telephone": { "type": "string" }
	},
	"required": ["name", "email"]
}

var testAddressDeref = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	
	"type": "object",
	
	"properties": {
		"billing_address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city":           { "type": "string" },
				"state":          { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		},
		"shipping_address": {
			"allOf": [
				{
					"type": "object",
					"properties": {
						"street_address": { "type": "string" },
						"city":           { "type": "string" },
						"state":          { "type": "string" }
					},
					"required": ["street_address", "city", "state"]
				},
				{
					"properties":
						{ "type": { "enum": [ "residential", "business" ] } },
					"required": ["type"]
				}
			]
		}
	}
}

// timer start
console.time("validations")


console.log(">>> object")
validateSchema(testschemaNoAdd, testdataBad)
validateSchema(testschema, testdataGood)
validateSchema(testStringSchema, testStringData)

console.log(">>> numbers")
validateSchema(testNumberSchema, -1)
validateSchema(testNumberSchema, 0)
validateSchema(testNumberSchema, 10)
validateSchema(testNumberSchema, 99)
validateSchema(testNumberSchema, 100)

console.log(">>> null")
validateSchema({ "type": "null" }, null)
validateSchema({ "type": "null" }, undefined)
validateSchema({}, undefined)

console.log(">>> required")
validateSchema(testRequiredProps, {})
validateSchema(testRequiredProps, {
	"name": "jack",
	"email": "jack@example.com",
	"address": "smt smt ave 666",
	"telephone": "555 5555",
})

console.log(">>> numProps")
validateSchema({
	"type": "object",
	"properties": {
		"prop1": {},
		"prop2": {},
	},
	"minProperties": 2,
	"maxProperties": 3,
}, testdataGood)

console.log(">>> dependency props")
var depPropSchema = {
	"type": "object",
	
	"properties": {
		"name": { "type": "string" },
		"credit_card": { "type": "number" },
		"billing_address": { "type": "string" }
	},
	
	"required": ["name"],
	
	"dependencies": {
		"credit_card": ["billing_address"]
	}
}
validateSchema(depPropSchema, {
	"name": "John Doe",
	"credit_card": 5555555555555555,
	"billing_address": "555 Debtor's Lane"
})

validateSchema(depPropSchema, {
	"name": "John Doe",
	"credit_card": 5555555555555555
})

validateSchema(depPropSchema, {
	"name": "John Doe"
})

validateSchema(depPropSchema, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
})


console.log(">>> dependency props (bidirectional)")
var depPropSchema2 = {
	"type": "object",
	
	"properties": {
		"name": { "type": "string" },
		"credit_card": { "type": "number" },
		"billing_address": { "type": "string" }
	},
	
	"required": ["name"],
	
	"dependencies": {
		"credit_card": ["billing_address"],
		"billing_address": ["credit_card"]
	}
}

validateSchema(depPropSchema2, {
	"name": "John Doe",
	"credit_card": 5555555555555555
})

validateSchema(depPropSchema2, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
})

console.log(">>> dependency props (schema)")
var depPropSchema3 = {
	"type": "object",
	
	"properties": {
		"name": { "type": "string" },
		"credit_card": { "type": "number" }
	},
	
	"required": ["name"],
	
	"dependencies": {
		"credit_card": {
			"properties": {
				"billing_address": { "type": "string" }
			},
			"required": ["billing_address"]
		}
	}
}
validateSchema(depPropSchema3, {
	"name": "John Doe",
	"credit_card": 5555555555555555,
	"billing_address": "555 Debtor's Lane"
})
validateSchema(depPropSchema3, {
	"name": "John Doe",
	"credit_card": 5555555555555555
})
validateSchema(depPropSchema3, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
})
//console.log(depPropSchema3)

console.log(">>> array validation (no restrictions)")
var arraySchema = {
	"type": "array"
}
validateSchema(arraySchema, [])
validateSchema(arraySchema, {"object": "not an array"})
validateSchema(arraySchema, [1, 2, 3])

console.log(">>> array validation (list)")
var numberArraySchema = {
	"type": "array",
	"items": {
		"type": "number"
	},
}
validateSchema(numberArraySchema, [1, 2, 3])
validateSchema(numberArraySchema, [1, "two", 3])
validateSchema(numberArraySchema, [])

console.log(">>> array validation (tuple)")
var tupleArraySchema = {
	"type": "array",
	"items": [
		{ "type": "number" },
		{ "type": "string" },
	],
}
validateSchema(tupleArraySchema, [22, "Acacia Avenue"])
validateSchema(tupleArraySchema, [1, 2, 3])
validateSchema(tupleArraySchema, [1, "two", 3])
validateSchema(tupleArraySchema, [])

console.log(">>> array validation (tuple, no additional items)")
var noAddTupleArraySchema = {
	"type": "array",
	"items": [
	{ "type": "number" },
	{ "type": "string" },
	],
	additionalItems: false,
}
validateSchema(noAddTupleArraySchema, [1, "two"])
validateSchema(noAddTupleArraySchema, [1, "two", 3])

console.log(">>> array validation (tuple, additional items string)")
var noAddTupleArraySchema = {
	"type": "array",
	"items": [
	{ "type": "number" },
	{ "type": "string" },
	],
	additionalItems: { "type": "string" },
}
validateSchema(noAddTupleArraySchema, [1, "two"])
validateSchema(noAddTupleArraySchema, [1, "two", "three"])
validateSchema(noAddTupleArraySchema, [1, "two", 3]) // no, expected integer
validateSchema(noAddTupleArraySchema, [1, "two", 3, "four"]) // no, expected integer
validateSchema(noAddTupleArraySchema, [1, "two", 3, "four", 5]) // no, expected integer x2

console.log(">>> array validation (minItems, maxItems)")
var minMaxArraySchema = {
	"type": "array",
	"minItems": 2,
	"maxItems": 3,
}
validateSchema(minMaxArraySchema, []) // no
validateSchema(minMaxArraySchema, [1]) // no
validateSchema(minMaxArraySchema, [1, "two"]) // yes
validateSchema(minMaxArraySchema, [1, "two", "three"]) // yes
validateSchema(minMaxArraySchema, [1, "two", 3, 4]) // no

console.log(">>> array validation (unique)")
var uniqueArraySchema = {
	"type": "array",
	"items": { "type": "number" },
	"uniqueItems": true,
}
validateSchema(uniqueArraySchema, [1, 2, 3])
validateSchema(uniqueArraySchema, [1, 2, 3, 2]) // no, 2 x2

console.log(">>> array validation (unique, mixed)")
var uniqueMixedArraySchema = {
	"type": "array",
	"uniqueItems": true,
}
validateSchema(uniqueMixedArraySchema, [1, 2, "", {}]) // yes
validateSchema(uniqueMixedArraySchema, [1, 2, "", {}, 3, {}, ""]) // no, "" === ""
validateSchema(uniqueMixedArraySchema, [1, 2, "", {}, 3, {}, "2"]) // yes, 2 !== "2"

console.log(">>> simple enum")
var enumSimpleSchema = {
	"enum": ["red", "amber", "green", null, 42]
}
validateSchema(enumSimpleSchema, "red") // yes
validateSchema(enumSimpleSchema, null) // yes
validateSchema(enumSimpleSchema, 42) // yes
validateSchema(enumSimpleSchema, 0) // no

console.log(">>> array validation (tuple + enum)")
var enumTupleSchema = {
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
validateSchema(enumTupleSchema, [1600, "Pennsylvania", "Avenue", "NW"]) // yes
validateSchema(enumTupleSchema, [24, "Sussex", "Drive"]) // no, "Drive" not accepted
validateSchema(enumTupleSchema, ["Palais de l'Élysée"]) // no, missing street number
validateSchema(enumTupleSchema, [10, "Downing", "Street"]) // yes, don't have to provide all items
validateSchema(enumTupleSchema, [1600, "Pennsylvania", "Avenue", "NW", "Washington"]) // yes, additional items allowed


console.log(">>> array validation (tuple + enum + noAdd)")
var enumTupleNoAddSchema = {
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
validateSchema(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue", "NW"]) // yes
validateSchema(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue"]) // yes, don't need to provide all items
validateSchema(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue", "NW", "Washington"]) // no, can't have additional items


console.log(">>> simple ref")
var refSimpleSchema = {
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
validateSchema(refSimpleSchema, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC"
	},
	"billing_address": {
		"street_address": "1st Street SE",
		"city": "Washington",
		"state": "DC"
	}
}) // ok
validateSchema(refSimpleSchema, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"statex": "DC"
	},
	"billing_address": {
		"street_address": "1st Street SE",
		"city": "Washington",
		"state": "DC"
	}
}) // missing prop: state
//console.log(refSimpleSchema.properties['shipping_address'])

console.log(">>> invalid ref")
var refInvalidSchema = {
	"type": "object",
	
	"properties": {
		"bad_ref": { "$ref": "#/definitions/nonexistent" }
	},
	required: ["bad_ref"],
}
try {
	validateSchema(refInvalidSchema, {"bad_ref": "noodles"}) // json-pointer: throw new Error('Invalid reference token: ' + tok);
} catch (e) {
	console.log(`[${e.constructor.name}]`, e.message)
}


console.log(">>> anyOf")
var simpleAnyOf = {
	"anyOf": [
	{ "type": "string", "maxLength": 5 },
	{ "type": "number", "minimum": 0 }
	]
}
validateSchema(simpleAnyOf, {}) // no, not string or number
validateSchema(simpleAnyOf, -1) // no, -1 < 0
validateSchema(simpleAnyOf, 1) // yes
validateSchema(simpleAnyOf, "short") // yes
console.log(simpleAnyOf.anyOf)
validateSchema(simpleAnyOf, "longer") // no, too long
console.log(simpleAnyOf.anyOf)

console.log(">>> oneOf")
var simpleOneOf = {
	"oneOf": [
	{ "type": "string", "maxLength": 5 },
	{ "type": "string", "maxLength": 10 },
	{ "type": "number", "minimum": 0 }
	]
}
validateSchema(simpleOneOf, {}) // no, not string or number
validateSchema(simpleOneOf, "xxx") // no, 2 schemas match
validateSchema(simpleOneOf, 666) // yes, matches number schema

console.log(">>> allOf")
var simpleAllOf = {
	"allOf": [
	{ "type": "string", "maxLength": 5 },
	{ "type": "string", "maxLength": 10 },
	{ "title": "random shit" },
	]
}
validateSchema(simpleAllOf, {}) // no, doesn't match string schemas
validateSchema(simpleAllOf, "short") // yes, matches all
validateSchema(simpleAllOf, "longer") // no, doesn't match string schema with length <= 5


console.log(">>> kitchensink Ref Combiner")
validateSchema(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC",
		"type": "business"
	}
}) // yes
validateSchema(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC"
	}
}) // no, missing type
//console.log("q:", testAddressRef.properties.shipping_address.allOf[1]['.q'])
validateSchema(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC",
		"type": "redhead"
	}
}) // no, value not in enum "redhead"
//console.log("q:", testAddressRef.properties.shipping_address.allOf[1].properties.type['.q'])


console.log(">>> iow")
validateSchema(schemaIow, {})



// timer stop
console.timeEnd("validations")
