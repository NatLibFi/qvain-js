// https://forum.vuejs.org/t/data-sync-on-deeply-nested-structures/40099/6

var testdata = {
	"person": {
		"name": "jack",
		"children": [
			{
				"name": "alice",
				"age": 4,
			},
			{
				"name": "peter",
				"age": 2,
			},			
		],
	},
	"id": 123,
}

var schema = {
	"type": "object",
	"title": "agent",
	"description": "agent description",
	"properties": {
		"person": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"title": "name",
				},
				"children": {
					"type": "array",
					"items": {
						"type": "object",
						"properties": {
							"name": {
								"type": "string",
							},
							"age": {
								"type": "number",
							}
						}
					}
				}
			}
		},
		"id": {
			"type": "number",
			"title": "primary identifier",
		}
	}
}

class SchemaObject {
	//children = []
	
	constructor(data, schema) {
		this.data = data
		this.schema = schema
		this.title = schema.title || null
		this.description = schema.description || null
		
		this.children = []
		this._properties = Object.keys(schema.properties)

		for (let prop in schema.properties) {
			let type = schema.properties.type
			switch (type) {
				case 'object':
					this.children.push(SchemaObject(data[prop] || {}, schema.properties[prop]))
					break
				case 'array':
					this.children.push(SchemaArray(data[prop] || [], schema.properties[prop]))
				case 'string':
					this.children.push(SchemaString(data[prop] || "", schema.properties[prop]))
				case 'number':
					this.children.push(SchemaNumber(data[prop] || undefined, schema.properties[prop]))
			}
		}
	}

	isValid() {
		return true
	}
}

class SchemaArray {
	//items: []
	
	constructor(data, schema) {
		this.data = data
		this.schema = schema
		this.title = schema.title || null
		this.description = schema.description || null

		this.items = []

		this.type = schema.items.type
		this.cls = getClassForSchema(type)
		for (let el in data) {
			items.push(this.cls(data[i] || getZeroForSchema(this.type), schema.items))
		}
	}

	add() {
		items.push(this.cls(getZeroForSchema(this.type)), this.schema.items)
	}

	isValid() {
		return this.items.length > 0
	}
}

class SchemaString {
	//value: undefined
	
	constructor(data, schema) {
		this.data = data
		this.schema = schema
		this.title = schema.title || null
		this.description = schema.description || null
	}

	isValid() {
		return this.data.length > 0
	}
}

class SchemaNumber {
	//value: undefined

	constructor(data, schema) {
		this.data = data
		this.schema = schema
		this.title = schema.title || null
		this.description = schema.description || null
	}

	isValid() {
		return this.data !== undefined
	}
}

function getClassForSchema(type) {
	switch (type) {
		case 'object':
			return SchemaObject
		case 'array':
			return schemaArray
		case 'string':
			return schemaString
		case 'number':
			return schemaNumber
	}
	throw Error("schemaclass: invalid schema type: " + type)
}

function getZeroForSchema(type) {
	switch (type) {
		case 'object':
			return {}
		case 'array':
			return []
		case 'string':
			return ""
		case 'number':
			return undefined
	}
	throw Error("zerovalue: invalid schema type: " + type)
}

var obj = new SchemaObject(testdata, schema)
