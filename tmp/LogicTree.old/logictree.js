//function logictree()

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
	c: [
		{ p: "/street_address", v: true },
		{ p: "/city", v: true },
		{ p: "/state", v: false, c: [
			{ p: "/state/something", v: true },
		]},
	],
	o: [
		{ p: "/oneof1", v: false },
		{ p: "/oneof2", v: false, c: [
			{ p: "/oneof2/alice", v: true },
			{ p: "/oneof2/bella", v: true },
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
	if (tree['c']) {
		for (c in tree['c']) {
			lTraverse(tree['c'][c])
		}
		console.log(tree.p, tree['c'].every(c => c.v))
		//tree.v = tree['c'].every(c => c.v)
		tmp = (tmp === undefined ? true : tmp) && tree['c'].every(c => c.v)
	}
	
	if (tree['o']) {
		for (c in tree['o']) {
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

console.log("conclusion:", lTraverse(schemaLogic))


var newTree = {
	'': false,
	'subschema': {
		'': false,
		'subsubschema': {
			'': true
		},
	},
	'subschema2': [
		true, false, true
	],
}

var newTraverse = function(tree, p) {
	console.log("in:", p || '/')
	console.log(tree)
	
	for (let c in tree) {
		console.log("c:", c)
		if (c === '') continue;
		if (tree[c] !== null && typeof tree[c] === 'object') {
			newTraverse(tree[c], p + '/' + c)
		}
		console.log(p || '/', tree[''], Object.keys(tree).forEach(x => console.log(x, tree[x])))
		console.log(p, "assigning:", Object.keys(tree).every(k => k ? ((tree instanceof Array) ? tree[k] : tree[k]['']) : true))
		tree[''] = Object.keys(tree).every(k => k ? ((tree instanceof Array) ? tree[k] : tree[k]['']) : true)
		console.log("fin", p || '/', tree, tree[''])
	}
	console.log(p, "exit:", tree[''])
	return tree['']
}

console.log("new:", newTraverse(newTree, ""))


function traverse(o,func) {
	for (var i in o) {
		func.apply(this,[i,o[i]]);
		if (o[i] !== null && typeof(o[i])=="object") {
			traverse(o[i],func);
		}
	}
}


function LogicTree() {
	return {}
}
LogicTree.prototype.setAndEval = function(path, val) {}
