var tree = {
	"type": "object",
	"properties": {
		"street_address": { "type": "string" },
		"city":           { "type": "string" },
		"state":          { "type": "string" }
	},
	"required": ["street_address", "city", "state"]
}

const sentinel = '💩'

function addValidation(o) {
	Object.defineProperty(o, '_validation', {
		enumerable: false,
		configurable: false,
		writable: true,
		//value: false
		value: function() { return false }
	})
}

addValidation(tree)

console.log(tree._validation)
console.log(JSON.stringify(tree))
