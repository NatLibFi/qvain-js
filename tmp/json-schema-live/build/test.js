"use strict";

var _validate = require("./validate.js");

var validator = new _validate.Validator({}, "");
console.log(validator.validate());

var coordSchema = { "$schema": "http://json-schema.org/draft-04/schema#", "description": "A geographical coordinate", "type": "object", "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } } };
var v2 = new _validate.Validator(coordSchema, {});
console.log(v2.validate());