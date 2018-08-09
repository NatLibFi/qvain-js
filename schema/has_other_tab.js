var schema = require("./qvain-fairdata-ui.json")

console.log(schema)

var ui = {
	"/properties/title": 1,
	"/properties/creator": 2,
	"/properties/creator/title": 1,
}

function doit(schema, path, searchtab, curtab) {
	console.log("in:", path)
	if (path in ui && typeof ui[path] === 'number') {
		curtab = ui[path]
		console.log(path, ':', ui[path])
	}
	if (curtab == searchtab) {
		console.log(path, ': true')
		return true
	}

	if (! (typeof schema === 'object')) return false
	if (! ('properties' in schema || 'items' in schema)) return false
	console.log("has items:", 'items' in schema)
	console.log("has properties:", 'properties' in schema)
	for (let key in schema.properties) {
		console.log(key)
		if (doit(schema.properties[key], path+'/properties/'+key, searchtab, curtab)) return true
	}
	console.log("here")
	for (let i in schema.items) {
		console.log(i)
		if (doit(schema.items[i], path+'/'+i, searchtab, curtab)) return true
	}
	console.log("there")

	return false
}

schema = schema.properties.creator
console.log(schema)

console.log(doit(schema, '/properties/creator', 1))
