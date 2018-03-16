"use strict";

//import getDataType from '../validate.js'
var getDataType = require('../validate.js')

var tree = {
	'l1-1': {
		'l2-1-1': {
			'l3-1-1-1': {
				'val': true
			},
		},
	},
	'l1-2': {
		'l2-2-1': {
			'val': false
		},
	},
}


var schema = {
	"type": "object",
	"properties": {
		"street_address": { "type": "string" },
		"city":           { "type": "string" },
		"state":          { "type": "string" }
	},
	"required": ["street_address", "city", "state"]
}


var schemaLogic = {
	p: "/",
	v: false,
	a: [
		{ p: "/street_address", v: true },
		{ p: "/city", v: true },
		{ p: "/state", v: false, a: [
			{ p: "/state/something", v: true },
		]},
	],
	o: [
		{ p: "/oneof1", v: false },
		{ p: "/oneof2", v: false, a: [
			{ p: "/oneof2/alice", v: true },
			{ p: "/oneof2/bella", v: false },
		]},
	],
	n: { p: "/not", v: false },
}


function LogicTree() {
	return {}
}
LogicTree.prototype.setAndEval = function(path, val) {}
LogicTree.prototype.traverse = function(tree) {}

var lTraverse = function(tree) {
	console.log("in:", tree.p)
	let tmp = undefined
	if (tree['a']) {
		for (let c in tree['a']) {
			lTraverse(tree['a'][c])
		}
		console.log(tree.p, tree['a'].every(c => c.v))
		//tree.v = tree['c'].every(c => c.v)
		tmp = (tmp === undefined ? true : tmp) && tree['a'].every(c => c.v)
	}
	
	if (tree['o']) {
		for (let c in tree['o']) {
			lTraverse(tree['o'][c])
		}
		console.log(tree.p, tree['o'].some(c => c.v))
		//tree.v = tree['o'].some(c => c.v)
		tmp = (tmp === undefined ? true : tmp) && tree['o'].some(c => c.v)
	}
	
	if (tree['n']) {
		//tree.v = !tree['n'].v
		tmp = (tmp === undefined ? true : tmp) && !tree['n'].v
	}
	
	if (tmp !== undefined) tree.v = tmp
	return tree.v
}

var walkBuild = function(schema, p) {
	var out = {}
	out.p = p
	out.v = false
	
	//console.log("in", p)
	
	for (let prop in schema) {}
	
	if ('properties' in schema) {
		//console.log("is object")
		out.a = []
		for (let prop in schema.properties) {
			out.a.push(walkBuild(schema.properties[prop], p + '/' + prop))
		}
	}
	
	if ('items' in schema) {
		out.a = []
		for (let el in schema.items) {
			out.a.push(walkBuild(schema.items[el], p + '/' + prop))
		}
	}
	
	if ('anyOf' in schema) {
		out.o = []
		for (let el in schema.anyOf) {
			out.o.push(walkBuild(schema.anyOf[el], p + '/' + prop))
		}
	}

	if ('allOf' in schema) {
		out.a = []
		for (let el in schema.allOf) {
			out.a.push(walkBuild(schema.allOf[el], p + '/' + prop))
		}
	}
	
	if ('oneOf' in schema) {
		out.x = []
		for (let el in schema.oneOf) {
			out.x.push(walkBuild(schema.oneOf[el], p + '/' + prop))
		}
	}
	
	if ('not' in schema) {
		out.n = walkBuild(schema.not, p + '/' + 'not')
	}
	
	//console.log("returning", out)
	return out
}

var buildLogicTree = function(schema) {
	return walkBuild(schema, '')
}

var schema2 = {
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
			"type": "object",
			"properties": {
				"street_address": { "type": "string" },
				"city":           { "type": "string" },
				"state":          { "type": "string" }
			},
			"required": ["street_address", "city", "state"]
		},
	}
}

//console.log("conclusion:", lTraverse(schemaLogic))
//console.log(buildLogicTree(schema2))
console.log(require('util').inspect(buildLogicTree(schema2), false, 10))
console.log("\n\n")

