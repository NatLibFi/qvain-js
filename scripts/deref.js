"use strict";

// location to latest schema
//var schema = require("../schema/schema.json")
var idaSchema = require("../schema/ida.json")
var attSchema = require("../schema/att.json")


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
	this.refCount = 0
	this.refTargets = {}
	this.derefDefs = false
	//this._copyRefs(schema, "")
}
SchemaDereferencer.prototype.constructor = SchemaDereferencer

SchemaDereferencer.prototype._copyRefs = function(schema, path) {
	if (typeof schema !== 'object') throw new Error("schema is not an object", path || "/")

	//if (!this.derefDefs && path.startsWith("/definitions/")) return

	for (let key in schema) {
		if (typeof schema[key] === 'object' && schema[key] !== null) this._copyRefs(schema[key], path + "/" + key)
	}

	if ('$ref' in schema) {
		this.refCount++
		let ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1)
		//console.log("ref at", path)

		this.refTargets[ptr] = (this.refTargets[ptr] || 0) + 1

		schema['$deref'] = schema['$ref']
		delete schema['$ref']

		//let ref = getPath(this.baseSchema, ptr)
		let ref = getPath(this.resolvedSchema, ptr)
		this._copyRefs(ref, ptr)
		
		let clone = deepCopy(ref)
		for (let key in clone) {
			//console.log("xxx", ptr, key)
			if (
				(ptr === "/definitions/langString" || ptr === "/definitions/Concept" || ptr === "/definitions/Document")
				&& key in schema && ['title', 'description', 'default'].indexOf(key) >= 0) continue
			schema[key] = clone[key]
		}
		if ('$ref' in schema) {
			console.log("ERROR: still found a $ref in schema:", schema['$ref'], "schema:", path)
			delete schema['$ref']
		}
	}
	//if ('definitions' in schema) delete schema['definitions']
	//if ('@id' in schema) delete schema['@id']
	if ('@type' in schema) console.log("@type at", path)
	//if ('@type' in schema) delete schema['@type']
	
}

SchemaDereferencer.prototype.deref = function() {
	this._copyRefs(this.resolvedSchema, "")
	if (!this.derefDefs) {
		console.log("dont want no derefed defs")
	}
	if ('definitions' in this.baseSchema) {
		console.log("yeah baseSchema has definitions")
	}

	if (!this.derefDefs && 'definitions' in this.baseSchema) {
		console.log("deleting ref'ed defs")
		delete this.resolvedSchema['definitions']
		console.log(Object.keys(this.resolvedSchema))
		this.resolvedSchema.definitions = deepCopy(this.baseSchema.definitions)
		console.log(Object.keys(this.resolvedSchema))
	}
}

SchemaDereferencer.prototype.listTargets = function() {
	var targets = Object.keys(this.refTargets)

	if (targets.length < 1) return;

	targets.sort()

	for (let i = 0; i < targets.length; i++) {
		let k = targets[i]
		console.log(k + ': ' + this.refTargets[k])
	}
}


SchemaDereferencer.prototype.addTargetCount = function() {
	for (let ptr in this.refTargets) {
		let obj = getPath(this.resolvedSchema, ptr)
		obj['$count'] = this.refTargets[ptr]
	}
}


function doit(schema, fn) {
	var dereferencer = new SchemaDereferencer(schema)
	dereferencer.deref()

	dereferencer.addTargetCount()

	//console.log(dereferencer.resolvedSchema)
	console.log("references:", dereferencer.refCount)
	console.log("reference target count:")
	dereferencer.listTargets()

	function saveSchema(schema) {
		var fs = require('fs')
		fs.writeFile(fn, JSON.stringify(schema, null, "\t"), function(err) {
			if(err) {
				return console.log(err)
			}

			console.log("schema successfully saved to", fn)
		})
	}

	saveSchema(dereferencer.resolvedSchema)
}

doit(idaSchema, "_ida.schema.json")
doit(attSchema, "_att.schema.json")
