"use strict";

var _validate = require("./validate.js");

var _schema = require("../../../schema/schema.json");

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testdataGood = { "latitude": 123, "longitude": 666 };
var testdataBad = { "latitude": 123, "extra": "extradata" };

var testschema = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } } };
var testschemaNoAdd = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } }, "additionalProperties": false };

var testStringData = "HELLO";
var testStringSchema = { "type": "string" };

var testNumberSchema = {
	"type": "number",
	"minimum": 0,
	"maximum": 100,
	"exclusiveMaximum": true,
	"multipleOf": 5

	//import schemaIowDeref from '../../../schema/deref.json'
};

var testAddressRef = {
	"$schema": "http://json-schema.org/draft-04/schema#",

	"definitions": {
		"address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city": { "type": "string" },
				"state": { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		}
	},

	"type": "object",

	"properties": {
		"billing_address": { "$ref": "#/definitions/address" },
		"shipping_address": {
			"allOf": [{ "$ref": "#/definitions/address" }, { "properties": { "type": { "enum": ["residential", "business"] } },
				"required": ["type"]
			}]
		}
	}
};

var testRequiredProps = {
	"type": "object",
	"properties": {
		"name": { "type": "string" },
		"email": { "type": "string" },
		"address": { "type": "string" },
		"telephone": { "type": "string" }
	},
	"required": ["name", "email"]
};

var testAddressDeref = {
	"$schema": "http://json-schema.org/draft-04/schema#",

	"type": "object",

	"properties": {
		"billing_address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city": { "type": "string" },
				"state": { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		},
		"shipping_address": {
			"allOf": [{
				"type": "object",
				"properties": {
					"street_address": { "type": "string" },
					"city": { "type": "string" },
					"state": { "type": "string" }
				},
				"required": ["street_address", "city", "state"]
			}, {
				"properties": { "type": { "enum": ["residential", "business"] } },
				"required": ["type"]
			}]
		}
	}

	// timer start
};console.time("validations");

console.log(">>> object");
(0, _validate.validateSchema)(testschemaNoAdd, testdataBad);
(0, _validate.validateSchema)(testschema, testdataGood);
(0, _validate.validateSchema)(testStringSchema, testStringData);

console.log(">>> numbers");
(0, _validate.validateSchema)(testNumberSchema, -1);
(0, _validate.validateSchema)(testNumberSchema, 0);
(0, _validate.validateSchema)(testNumberSchema, 10);
(0, _validate.validateSchema)(testNumberSchema, 99);
(0, _validate.validateSchema)(testNumberSchema, 100);

console.log(">>> null");
(0, _validate.validateSchema)({ "type": "null" }, null);
(0, _validate.validateSchema)({ "type": "null" }, undefined);
(0, _validate.validateSchema)({}, undefined);

console.log(">>> required");
(0, _validate.validateSchema)(testRequiredProps, {});
(0, _validate.validateSchema)(testRequiredProps, {
	"name": "jack",
	"email": "jack@example.com",
	"address": "smt smt ave 666",
	"telephone": "555 5555"
});

console.log(">>> numProps");
(0, _validate.validateSchema)({
	"type": "object",
	"properties": {
		"prop1": {},
		"prop2": {}
	},
	"minProperties": 2,
	"maxProperties": 3
}, testdataGood);

console.log(">>> dependency props");
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
};
(0, _validate.validateSchema)(depPropSchema, {
	"name": "John Doe",
	"credit_card": 5555555555555555,
	"billing_address": "555 Debtor's Lane"
});

(0, _validate.validateSchema)(depPropSchema, {
	"name": "John Doe",
	"credit_card": 5555555555555555
});

(0, _validate.validateSchema)(depPropSchema, {
	"name": "John Doe"
});

(0, _validate.validateSchema)(depPropSchema, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
});

console.log(">>> dependency props (bidirectional)");
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
};

(0, _validate.validateSchema)(depPropSchema2, {
	"name": "John Doe",
	"credit_card": 5555555555555555
});

(0, _validate.validateSchema)(depPropSchema2, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
});

console.log(">>> dependency props (schema)");
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
};
(0, _validate.validateSchema)(depPropSchema3, {
	"name": "John Doe",
	"credit_card": 5555555555555555,
	"billing_address": "555 Debtor's Lane"
});
(0, _validate.validateSchema)(depPropSchema3, {
	"name": "John Doe",
	"credit_card": 5555555555555555
});
(0, _validate.validateSchema)(depPropSchema3, {
	"name": "John Doe",
	"billing_address": "555 Debtor's Lane"
});
//console.log(depPropSchema3)

console.log(">>> array validation (no restrictions)");
var arraySchema = {
	"type": "array"
};
(0, _validate.validateSchema)(arraySchema, []);
(0, _validate.validateSchema)(arraySchema, { "object": "not an array" });
(0, _validate.validateSchema)(arraySchema, [1, 2, 3]);

console.log(">>> array validation (list)");
var numberArraySchema = {
	"type": "array",
	"items": {
		"type": "number"
	}
};
(0, _validate.validateSchema)(numberArraySchema, [1, 2, 3]);
(0, _validate.validateSchema)(numberArraySchema, [1, "two", 3]);
(0, _validate.validateSchema)(numberArraySchema, []);

console.log(">>> array validation (tuple)");
var tupleArraySchema = {
	"type": "array",
	"items": [{ "type": "number" }, { "type": "string" }]
};
(0, _validate.validateSchema)(tupleArraySchema, [22, "Acacia Avenue"]);
(0, _validate.validateSchema)(tupleArraySchema, [1, 2, 3]);
(0, _validate.validateSchema)(tupleArraySchema, [1, "two", 3]);
(0, _validate.validateSchema)(tupleArraySchema, []);

console.log(">>> array validation (tuple, no additional items)");
var noAddTupleArraySchema = {
	"type": "array",
	"items": [{ "type": "number" }, { "type": "string" }],
	additionalItems: false
};
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two"]);
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two", 3]);

console.log(">>> array validation (tuple, additional items string)");
var noAddTupleArraySchema = {
	"type": "array",
	"items": [{ "type": "number" }, { "type": "string" }],
	additionalItems: { "type": "string" }
};
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two"]);
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two", "three"]);
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two", 3]); // no, expected integer
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two", 3, "four"]); // no, expected integer
(0, _validate.validateSchema)(noAddTupleArraySchema, [1, "two", 3, "four", 5]); // no, expected integer x2

console.log(">>> array validation (minItems, maxItems)");
var minMaxArraySchema = {
	"type": "array",
	"minItems": 2,
	"maxItems": 3
};
(0, _validate.validateSchema)(minMaxArraySchema, []); // no
(0, _validate.validateSchema)(minMaxArraySchema, [1]); // no
(0, _validate.validateSchema)(minMaxArraySchema, [1, "two"]); // yes
(0, _validate.validateSchema)(minMaxArraySchema, [1, "two", "three"]); // yes
(0, _validate.validateSchema)(minMaxArraySchema, [1, "two", 3, 4]); // no

console.log(">>> array validation (unique)");
var uniqueArraySchema = {
	"type": "array",
	"items": { "type": "number" },
	"uniqueItems": true
};
(0, _validate.validateSchema)(uniqueArraySchema, [1, 2, 3]);
(0, _validate.validateSchema)(uniqueArraySchema, [1, 2, 3, 2]); // no, 2 x2

console.log(">>> array validation (unique, mixed)");
var uniqueMixedArraySchema = {
	"type": "array",
	"uniqueItems": true
};
(0, _validate.validateSchema)(uniqueMixedArraySchema, [1, 2, "", {}]); // yes
(0, _validate.validateSchema)(uniqueMixedArraySchema, [1, 2, "", {}, 3, {}, ""]); // no, "" === ""
(0, _validate.validateSchema)(uniqueMixedArraySchema, [1, 2, "", {}, 3, {}, "2"]); // yes, 2 !== "2"

console.log(">>> simple enum");
var enumSimpleSchema = {
	"enum": ["red", "amber", "green", null, 42]
};
(0, _validate.validateSchema)(enumSimpleSchema, "red"); // yes
(0, _validate.validateSchema)(enumSimpleSchema, null); // yes
(0, _validate.validateSchema)(enumSimpleSchema, 42); // yes
(0, _validate.validateSchema)(enumSimpleSchema, 0); // no

console.log(">>> array validation (tuple + enum)");
var enumTupleSchema = {
	"type": "array",
	"items": [{
		"type": "number"
	}, {
		"type": "string"
	}, {
		"type": "string",
		"enum": ["Street", "Avenue", "Boulevard"]
	}, {
		"type": "string",
		"enum": ["NW", "NE", "SW", "SE"]
	}]
};
(0, _validate.validateSchema)(enumTupleSchema, [1600, "Pennsylvania", "Avenue", "NW"]); // yes
(0, _validate.validateSchema)(enumTupleSchema, [24, "Sussex", "Drive"]); // no, "Drive" not accepted
(0, _validate.validateSchema)(enumTupleSchema, ["Palais de l'Élysée"]); // no, missing street number
(0, _validate.validateSchema)(enumTupleSchema, [10, "Downing", "Street"]); // yes, don't have to provide all items
(0, _validate.validateSchema)(enumTupleSchema, [1600, "Pennsylvania", "Avenue", "NW", "Washington"]); // yes, additional items allowed


console.log(">>> array validation (tuple + enum + noAdd)");
var enumTupleNoAddSchema = {
	"type": "array",
	"items": [{
		"type": "number"
	}, {
		"type": "string"
	}, {
		"type": "string",
		"enum": ["Street", "Avenue", "Boulevard"]
	}, {
		"type": "string",
		"enum": ["NW", "NE", "SW", "SE"]
	}],
	"additionalItems": false
};
(0, _validate.validateSchema)(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue", "NW"]); // yes
(0, _validate.validateSchema)(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue"]); // yes, don't need to provide all items
(0, _validate.validateSchema)(enumTupleNoAddSchema, [1600, "Pennsylvania", "Avenue", "NW", "Washington"]); // no, can't have additional items


console.log(">>> simple ref");
var refSimpleSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",

	"definitions": {
		"address": {
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city": { "type": "string" },
				"state": { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		}
	},

	"type": "object",

	"properties": {
		"billing_address": { "$ref": "#/definitions/address" },
		"shipping_address": { "$ref": "#/definitions/address" }
	}
};
(0, _validate.validateSchema)(refSimpleSchema, {
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
}); // ok
(0, _validate.validateSchema)(refSimpleSchema, {
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
}); // missing prop: state
//console.log(refSimpleSchema.properties['shipping_address'])

console.log(">>> invalid ref");
var refInvalidSchema = {
	"type": "object",

	"properties": {
		"bad_ref": { "$ref": "#/definitions/nonexistent" }
	},
	required: ["bad_ref"]
};
try {
	(0, _validate.validateSchema)(refInvalidSchema, { "bad_ref": "noodles" }); // json-pointer: throw new Error('Invalid reference token: ' + tok);
} catch (e) {
	console.log("[" + e.constructor.name + "]", e.message);
}

console.log(">>> anyOf");
var simpleAnyOf = {
	"anyOf": [{ "type": "string", "maxLength": 5 }, { "type": "number", "minimum": 0 }]
};
(0, _validate.validateSchema)(simpleAnyOf, {}); // no, not string or number
(0, _validate.validateSchema)(simpleAnyOf, -1); // no, -1 < 0
(0, _validate.validateSchema)(simpleAnyOf, 1); // yes
(0, _validate.validateSchema)(simpleAnyOf, "short"); // yes
console.log(simpleAnyOf.anyOf);
(0, _validate.validateSchema)(simpleAnyOf, "longer"); // no, too long
console.log(simpleAnyOf.anyOf);

console.log(">>> oneOf");
var simpleOneOf = {
	"oneOf": [{ "type": "string", "maxLength": 5 }, { "type": "string", "maxLength": 10 }, { "type": "number", "minimum": 0 }]
};
(0, _validate.validateSchema)(simpleOneOf, {}); // no, not string or number
(0, _validate.validateSchema)(simpleOneOf, "xxx"); // no, 2 schemas match
(0, _validate.validateSchema)(simpleOneOf, 666); // yes, matches number schema

console.log(">>> allOf");
var simpleAllOf = {
	"allOf": [{ "type": "string", "maxLength": 5 }, { "type": "string", "maxLength": 10 }, { "title": "random shit" }]
};
(0, _validate.validateSchema)(simpleAllOf, {}); // no, doesn't match string schemas
(0, _validate.validateSchema)(simpleAllOf, "short"); // yes, matches all
(0, _validate.validateSchema)(simpleAllOf, "longer"); // no, doesn't match string schema with length <= 5


console.log(">>> kitchensink Ref Combiner");
(0, _validate.validateSchema)(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC",
		"type": "business"
	}
}); // yes
(0, _validate.validateSchema)(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC"
	}
}); // no, missing type
//console.log("q:", testAddressRef.properties.shipping_address.allOf[1]['.q'])
(0, _validate.validateSchema)(testAddressRef, {
	"shipping_address": {
		"street_address": "1600 Pennsylvania Avenue NW",
		"city": "Washington",
		"state": "DC",
		"type": "redhead"
	}
}); // no, value not in enum "redhead"
//console.log("q:", testAddressRef.properties.shipping_address.allOf[1].properties.type['.q'])


console.log(">>> iow");
(0, _validate.validateSchema)(_schema2.default, {});

// timer stop
console.timeEnd("validations");