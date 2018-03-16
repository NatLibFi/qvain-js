"use strict";

var schema = {
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


var schema = require("../schema/schema.json")



function parsePath(path) {
	if (path === "") return [];
	if (path[0] !== "/") throw new Error("invalid path:" + path);
	return path.substring(1).split(/\//).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));
}


function getPath(obj, path) {
	var els = parsePath(path)
	
	for (var i = 0; i < els.length; ++i) {
		var el = els[i];
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

// Makes a deep copy from an object
// NOTE: uses Array.isArray()
// @param {Object} src - nested object
// @return {Object} - copied object without hard references
// @see {@link https://github.com/zxdong262/deep-copy}
// @see {@link http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript}
function deepCopy(src) {
	if (src === null || typeof(src) !== 'object'){
		return src
	}
	if (Array.isArray(src)) {
		let ret = src.slice()
		let i = ret.length
		while (i--) {
			ret[i] = deepCopy(ret[i])
		}
		return ret
	}
	let dest = {}
	for (let key in src) {
		dest[key] = deepCopy(src[key])
	}
	return dest
}


function SchemaDereferencer(schema) {
	this.baseSchema = deepCopy(schema)
	this.resolvedSchema = deepCopy(schema)
	//this.newSchema = deepCopy(schema)
	this.refCount = 0
	//this._copyRefs(schema, "")
}
//SchemaDereferencer.prototype.constructor = SchemaDereferencer

SchemaDereferencer.prototype._copyRefs = function(schema, path) {
	if (typeof schema !== 'object') throw new Error("schema is not an object", path || "/")

		
	for (let key in schema) {
		if (typeof schema[key] === 'object' && schema[key] !== null) this._copyRefs(schema[key], path + "/" + key)
	}
		
	if ('$ref' in schema) {
		this.refCount++
		let ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1);
		//console.log("ref at", path) // /definitions/CatalogRecord/properties/dataset_json
		
		schema['$deref'] = schema['$ref']
		delete schema['$ref']

		let ref = getPath(this.baseSchema, ptr)
		this._copyRefs(ref, ptr)
		//if (path === "/definitions/CatalogRecord/properties/dataset_json") console.log("-wvh-", copy)
		
		let clone = deepCopy(ref)
		for (let key in clone) {
			schema[key] = clone[key]
		}
		if ('$ref' in schema) {
			console.log("ERROR: still found a $ref in schema:", schema['$ref'], "schema:", path)
			delete schema['$ref']
		}
	}
	if ('definitions' in schema) delete schema['definitions']
	if ('@id' in schema) delete schema['@id']
	if ('@type' in schema) delete schema['@type']
	
}

SchemaDereferencer.prototype.deref = function() {
	this._copyRefs(this.resolvedSchema, "")
}


var dereferencer = new SchemaDereferencer(schema)
dereferencer.deref()
/*
getPath(dereferencer.baseSchema, "/properties/shipping_address/properties/city")['blah'] = "test"
console.log(dereferencer.baseSchema.properties.billing_address)
*/

console.log(dereferencer.resolvedSchema)
console.log(dereferencer.refCount)

function saveSchema(schema) {
	var fs = require('fs');
	fs.writeFile("deref-nodefs-noxml.json", JSON.stringify(schema), function(err) {
		if(err) {
			return console.log(err);
		}
		
		console.log("The file was saved!");
	});
}

saveSchema(dereferencer.resolvedSchema)
