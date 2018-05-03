//import Validator from "./src/validate.js"
var assert = require('assert');
var Validator = require('../build/validate.js').default

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe("string", function() {
	var schema = {
		'type': "string"
	}
	var validator = new Validator(schema)
	describe("good", function() {
		it("should accept a regular string", function() {
			assert.ok(validator.validateData("jack"))
		})
		it("should accept an empty string", function() {
			assert.ok(validator.validateData(""))
		})
	})
	describe("bad", function() {
		it("should not accept a number", function() {
			assert.ok(!validator.validateData(666))
		})
		it("should not accept a date", function() {
			assert.ok(!validator.validateData(new Date()))
		})
	})
})

describe("number", function() {
	var schema = {
		"type": "number",
		 "minimum": 0,
		 "maximum": 100,
		 "exclusiveMaximum": true,
		 "multipleOf": 5,
	}
	var validator = new Validator(schema)
	describe("good", function() {
		it("should accept a positive number", function() {
			assert.ok(validator.validateData(10))
		})
		it("should accept zero", function() {
			assert.ok(validator.validateData(0))
		})
	})
	describe("bad", function() {
		it("should not accept a exclusively too large number", function() {
			assert.ok(!validator.validateData(100))
		})
		it("should not accept a number that's not a multiple of 5", function() {
			assert.ok(!validator.validateData(99))
		})
		it("should not accept a negative number", function() {
			assert.ok(!validator.validateData(-1))
		})
	})
})

describe("null", function() {
	var validator = new Validator({
		"type": "null"
	})
	describe("good", function() {
		it("should accept null", function() {
			assert.ok(validator.validateData(null))
		})
	})
	describe("bad", function() {
		it("should not accept a non-null object", function() {
			assert.ok(!validator.validateData({}))
		})
		it("should not accept the string \"null\"", function() {
			assert.ok(!validator.validateData("null"))
		})
		it("should not accept undefined", function() {
			assert.ok(!validator.validateData(undefined))
		})
	})
})

describe("required", function() {
	var validator = new Validator({
		"type": "object",
		"properties": {
			"name":      { "type": "string" },
			"email":     { "type": "string" },
			"address":   { "type": "string" },
			"telephone": { "type": "string" }
		},
		"required": ["name", "email"]
	})
	describe("good", function() {
		it("should accept required props", function() {
			assert.ok(validator.validateData({
				"name": "jack",
				"email": "jack@example.com",
				"address": "smt smt ave 666",
				"telephone": "555 5555",
			}))
		})
	})
	describe("bad", function() {
		it("should not accept missing props", function() {
			assert.ok(!validator.validateData({
				"name": "jack",
				"address": "smt smt ave 666",
				"telephone": "555 5555",
			}))
		})
		it("should not accept props with the wrong type", function() {
			assert.ok(!validator.validateData({
				"name": "jack",
				"email": 13,
				"address": "smt smt ave 666",
				"telephone": "555 5555",
			}))
		})
	})
})

describe("numProps", function() {
	var validator = new Validator({
		"type": "object",
		"properties": {
			"prop1": {},
			"prop2": {},
		},
		"minProperties": 2,
		"maxProperties": 3,
	})
	describe("good", function() {
		it("should accept 2 or 3 props", function() {
			assert.ok(validator.validateData({
				"latitude": 123,
				"longitude": 666,
			}))
		})
	})
	describe("bad", function() {
		it("should not accept too few props", function() {
			assert.ok(!validator.validateData({
				"toofew": 1,
			}))
		})
		it("should not accept too many props", function() {
			assert.ok(!validator.validateData({
				"one": 1,
				"two": 2,
				"three": 3,
				"four": 4,
			}))
		})
	})
})

describe("dependency props", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept prop dependency", function() {
			assert.ok(validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555,
				"billing_address": "555 Debtor's Lane"
			}))
		})
		it("should accept missing dependency prop if dependant is missing too", function() {
			assert.ok(validator.validateData({
				"name": "John Doe"
			}))
		})
		it("should accept missing dependant prop", function() {
			assert.ok(validator.validateData({
				"name": "John Doe",
				"billing_address": "555 Debtor's Lane"
			}))
		})
	})
	describe("bad", function() {
		it("should not accept missing prop dependency", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555
			}))
		})
		it("should not accept missing prop dependency if it's the wrong type", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555,
				"billing_address": 666
			}))
		})
	})
})

describe("dependency props (bidirectional)", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept bidirectional prop dependency", function() {
			assert.ok(validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555,
				"billing_address": "555 Debtor's Lane"
			}))
		})
	})
	describe("bad", function() {
		it("should not accept missing bidirectional dependency #1", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555
			}))
		})
		it("should not accept missing bidirectional dependency #2", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"billing_address": "555 Debtor's Lane"
			}))
		})
	})
})

describe("dependency props (schema)", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept schema prop dependency", function() {
			assert.ok(validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555,
				"billing_address": "555 Debtor's Lane"
			}))
		})
		it("should accept schema prop dependency with missing dependant", function() {
			assert.ok(validator.validateData({
				"name": "John Doe",
				"billing_address": "555 Debtor's Lane"
			}))
		})
	})
	describe("bad", function() {
		it("should not accept missing schema dependency", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555
			}))
		})
		it("should not accept failing schema dependency", function() {
			assert.ok(!validator.validateData({
				"name": "John Doe",
				"credit_card": 5555555555555555,
				"billing_address": 13
			}))
		})
	})
})

describe("array", function() {
	var validator = new Validator({
		"type": "array"
	})
	describe("good", function() {
		it("should accept array", function() {
			assert.ok(validator.validateData([1, 2, 3]))
		})
		it("should accept empty array", function() {
			assert.ok(validator.validateData([]))
		})
	})
	describe("bad", function() {
		it("should not accept a (real) object", function() {
			assert.ok(!validator.validateData({
				"object": "not an array"
			}))
		})
	})
})

describe("array validation: list", function() {
	var validator = new Validator({
		"type": "array",
		"items": {
			"type": "number"
		},
	})
	describe("good", function() {
		it("should accept an array of numbers", function() {
			assert.ok(validator.validateData([1, 2, 3]))
		})
		it("should accept empty array", function() {
			assert.ok(validator.validateData([]))
		})
	})
	describe("bad", function() {
		it("should not accept an array of numbers with a string sneaked in", function() {
			assert.ok(!validator.validateData([1, "two", 3]))
		})
	})
})

describe("array validation: tuple", function() {
	var validator = new Validator({
		"type": "array",
		"items": [
			{ "type": "number" },
			{ "type": "string" },
		],
	})
	describe("good", function() {
		it("should accept an array according to tuple rules", function() {
			assert.ok(validator.validateData([22, "Acacia Avenue"]))
		})
		it("should accept an array according to tuple rules with extra elements", function() {
			assert.ok(validator.validateData([1, "two", 3]))
		})
		it("should accept an array with less than tuple elements", function() {
			assert.ok(validator.validateData([1]))
		})
		it("should accept an empty array", function() {
			assert.ok(validator.validateData([]))
		})
	})
	describe("bad", function() {
		it("should not accept an array that doesn't obey tuple rules #1", function() {
			assert.ok(!validator.validateData([1, 2, 3]))
		})
		it("should not accept an array that doesn't obey tuple rules #2", function() {
			assert.ok(!validator.validateData(["Acacia Avenue", 22]))
		})
	})
})

describe("array validation: tuple; no additional items", function() {
	var validator = new Validator({
		"type": "array",
		"items": [
			{ "type": "number" },
			{ "type": "string" },
		],
		additionalItems: false,
	})
	describe("good", function() {
		it("should accept an array according to tuple rules", function() {
			assert.ok(validator.validateData([22, "Acacia Avenue"]))
		})
		it("should accept an array with less than tuple elements", function() {
			assert.ok(validator.validateData([1]))
		})
		it("should accept an empty array", function() {
			assert.ok(validator.validateData([]))
		})
	})
	describe("bad", function() {
		it("should not accept an array that has additional items", function() {
			assert.ok(!validator.validateData([1, "two", 3]))
		})
	})
})

describe("array validation: tuple; additional items of string type", function() {
	var validator = new Validator({
		"type": "array",
		"items": [
			{ "type": "number" },
			{ "type": "string" },
		],
		additionalItems: { "type": "string" },
	})
	describe("good", function() {
		it("should accept an array with an additional item of the correct type", function() {
			assert.ok(validator.validateData([1, "two", "three"]))
		})
		it("should accept an array with multiple additional items of the correct type", function() {
			assert.ok(validator.validateData([1, "two", "three", "four"]))
		})
		it("should accept an array without additional items", function() {
			assert.ok(validator.validateData([1, "two"]))
		})
		it("should accept an array with less than tuple elements", function() {
			assert.ok(validator.validateData([1]))
		})
		it("should accept an empty array", function() {
			assert.ok(validator.validateData([]))
		})
	})
	describe("bad", function() {
		it("should not accept an array that has an additional item of the wrong type", function() {
			assert.ok(!validator.validateData([1, "two", 3]))
		})
		it("should not accept an array that has multiple additional items of the wrong type", function() {
			assert.ok(!validator.validateData([1, "two", 3, "four", 5]))
		})
	})
})

describe("array validation: unique", function() {
	var validator = new Validator({
		"type": "array",
		"uniqueItems": true,
	})
	describe("good", function() {
		it("should accept an array with unique items", function() {
			assert.ok(validator.validateData([1, 2, "", {}]))
		})
		it.skip("should accept an array with unique items even with empty objects and number/string items", function() {
			assert.ok(validator.validateData([1, 2, "", {}, 3, {}, "2"]))
		})
	})
	describe("bad", function() {
		it("should not accept an array that has non-unique items", function() {
			assert.ok(!validator.validateData([1, 2, "", {}, 3, {}, ""]))
		})
	})
})

describe("enum", function() {
	var validator = new Validator({
		"enum": ["red", "amber", "green", null, 42]
	})
	describe("good", function() {
		it("should accept a string enum member", function() {
			assert.ok(validator.validateData("red"))
		})
		it("should accept a null enum member", function() {
			assert.ok(validator.validateData(null))
		})
		it("should accept a number enum member", function() {
			assert.ok(validator.validateData(42))
		})
	})
	describe("bad", function() {
		it("should not accept a value that is not in the enum", function() {
			assert.ok(!validator.validateData(0))
		})
	})
})

describe("array validation: tuple + enum", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept valid data for tuple enum schema", function() {
			assert.ok(validator.validateData([1600, "Pennsylvania", "Avenue", "NW"]))
		})
		it("should accept valid data for tuple enum schema with missing non-required items", function() {
			assert.ok(validator.validateData([10, "Downing", "Street"]))
		})
		it("should accept valid data for tuple enum schema with additional items", function() {
			assert.ok(validator.validateData([1600, "Pennsylvania", "Avenue", "NW", "Washington"]))
		})
	})
	describe("bad", function() {
		it("should not accept a value for an item that is not in its enum", function() {
			assert.ok(!validator.validateData([24, "Sussex", "Drive"]))
		})
		it("should not accept missing items in the tuple", function() {
			assert.ok(!validator.validateData(["Palais de l'Élysée"]))
		})
	})
})

describe("array validation: tuple + enum + no additional items", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept valid data for tuple enum no-add schema", function() {
			assert.ok(validator.validateData([1600, "Pennsylvania", "Avenue", "NW"]))
		})
		it("should accept valid data for tuple enum no-add schema with missing non-required items", function() {
			assert.ok(validator.validateData([1600, "Pennsylvania", "Avenue"]))
		})
	})
	describe("bad", function() {
		it("should not accept additional items for tuple enum schema", function() {
			assert.ok(!validator.validateData([1600, "Pennsylvania", "Avenue", "NW", "Washington"]))
		})
	})
})

describe("simple ref", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should validate correct data with references", function() {
			assert.ok(validator.validateData({
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
			}))
		})
	})
	describe("bad", function() {
		it("should not validate data with references if a prop is missing", function() {
			// missing prop: state
			assert.ok(!validator.validateData({
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
			}))
		})
	})
})

describe("non-existing ref", function() {
	var validator = new Validator({
		"type": "object",

		"properties": {
			"bad_ref": { "$ref": "#/definitions/nonexistent" }
		},
		required: ["bad_ref"],
	},
	{
		"bad_ref": "noodles"
	})
	describe("bad", function() {
		it("should throw on bad references", function() {
			assert.throws(
				validator.validate,
				Error
			)
		})
	})
})

describe("anyOf", function() {
	var validator = new Validator({
		"anyOf": [
			{ "type": "string", "maxLength": 5 },
			{ "type": "number", "minimum": 0 }
		]
	})
	describe("good", function() {
		it("should accept a valid anyOf number value", function() {
			assert.ok(validator.validateData(1))
		})
		it("should accept a valid anyOf string value", function() {
			assert.ok(validator.validateData("short"))
		})
	})
	describe("bad", function() {
		it("should not accept a number value that fails an anyOf condition", function() {
			assert.ok(!validator.validateData(-1))
		})
		it("should not accept a string value that fails an anyOf condition", function() {
			assert.ok(!validator.validateData("longer"))
		})
		it("should not accept a value with a type that fails all anyOf conditions", function() {
			assert.ok(!validator.validateData({}))
		})
	})
})

describe("oneOf", function() {
	var validator = new Validator({
		"oneOf": [
			{ "type": "string", "maxLength": 5 },
			{ "type": "string", "maxLength": 10 },
			{ "type": "number", "minimum": 0 }
		]
	})
	describe("good", function() {
		it("should accept a valid oneOf number value", function() {
			assert.ok(validator.validateData(666))
		})
		it("should accept a valid oneOf string value", function() {
			assert.ok(validator.validateData("seventh"))
		})
	})
	describe("bad", function() {
		it("should not accept a value that passes multiple oneOf conditions", function() {
			assert.ok(!validator.validateData("xxx"))
		})
		it("should not accept a value with a type that fails all oneOf conditions", function() {
			assert.ok(!validator.validateData({}))
		})
	})
})

describe("allOf", function() {
	var validator = new Validator({
		"allOf": [
			{ "type": "string", "maxLength": 5 },
			{ "type": "string", "maxLength": 10 },
			{ "title": "random shit" },
		]
	})
	describe("good", function() {
		it("should accept a valid allOf string value", function() {
			assert.ok(validator.validateData("short"))
		})
	})
	describe("bad", function() {
		it("should not accept a value that fails some allOf conditions", function() {
			assert.ok(!validator.validateData("too long"))
		})
		it("should not accept a value with a type that fails all allOf conditions", function() {
			assert.ok(!validator.validateData({}))
		})
	})
})

describe("combiner with ref", function() {
	var validator = new Validator({
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
	})
	describe("good", function() {
		it("should accept valid data for combiner with reference", function() {
			assert.ok(validator.validateData({
				"shipping_address": {
					"street_address": "1600 Pennsylvania Avenue NW",
					"city": "Washington",
					"state": "DC",
					"type": "business"
				}
			}))
		})
	})
	describe("bad", function() {
		it("should not accept data with missing prop for combiner with reference", function() {
			assert.ok(!validator.validateData({
				"shipping_address": {
					"street_address": "1600 Pennsylvania Avenue NW",
					"city": "Washington",
					"state": "DC",
				}
			}))
		})
		it("should not accept data with invalid enum value for combiner with reference", function() {
			assert.ok(!validator.validateData({
				"shipping_address": {
					"street_address": "1600 Pennsylvania Avenue NW",
					"city": "Washington",
					"state": "DC",
					"type": "redhead"
				}
			}))
		})
	})
})

