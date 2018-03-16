"use strict";

var _validate = require("./validate.js");

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
};

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

/*
console.log(">>> allOf")
validateSchema(testAddressDeref, "")
*/