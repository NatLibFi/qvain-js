//require('core-js/fn/set');
import SchemaParser from './schemaparser.js'
import testSchemas from '../testschemas.js'

var _schemaLog = "<no schema>"

function schemaLog(line) {
	//console.log("schemaLog() called")
	_schemaLog += line + "\n"
}


function isObject(thing) {
	return thing !== null && typeof thing === 'object' && !(thing instanceof String || thing instanceof Array || typeof thing === 'function')
}



// ---------------------------------

function initialCheck(schema) {
	if (!isObject(schema)) {
		throw "not an object"
	}
}


export default {
	data: function() {
		return {
			selectedSchema: '',
			schemaSource: {},
			schemaOutput: "",
			schemaError: "",
			schemaErrorState: false,
			showSchemaSource: false,
			showSchemaOutput: true,
			showSchemaDefinitions: true,
			schemaDefinitions: "",
			stats: {
				schemaLength: 0, // Object.keys(this.schemaSource).length,
				schemaRules: 0,
			},
			showStats: true,
			widgets: [],
		}
	},
	methods: {
		loadSchema: function(schemaName) {
			this.schemaSource = {}
			//this.schemaError = ""
			console.log("schemaName:", schemaName, testSchemas)
			
			if (!(schemaName in testSchemas)) {
				this.schemaError = "schema not found"
				return
			}
			
			this.schemaSource = testSchemas[schemaName]

			try {
				initialCheck(this.schemaSource)
			}
			catch(err) {
				this.schemaError = 'load: ' + err
				console.log("catch:", err)
			}
		},
		parseSchema: function() {
			_schemaLog = ""
			this.schemaOutput = _schemaLog
			
			try {
				var jsparser = new SchemaParser(this.schemaSource, schemaLog)
				jsparser.parseDoc()
			}
			catch(err) {
				this.schemaError = 'parse: ' + err
				console.log("catch:", err)
			}
			this.schemaOutput = _schemaLog
			this.schemaDefinitions = jsparser.definition
			//jsparser.walkSchema(this.schemaSource, console.log.bind(console))
			jsparser.walkWithContext(this.schemaSource, console.log.bind(console))
			
		},
		getTestSchemaNames: function() {
			return Object.keys(testSchemas)
		},
		log: function() {
			console.log("boo!")
		},
	},
	computed: {
		hasSchemaError: function() {
			return this.schemaError.length !== 0
		},
		schemaStatus: function() {
			if (Object.keys(this.schemaSource).length === 0) {
				//return "no schema selected"
				return ""
			} else {
				return this.schemaError.length !== 0 ? this.schemaError : "schema parsed successfully"
			}
		},
		/*
		changeSchema: function() {
			this.loadSchema(this.selectedSchema)
		},
		*/
	},
	watch: {
		selectedSchema: function() {
			console.log("watcher called", this.selectedSchema)
			this.loadSchema(this.selectedSchema)
		},
		schemaSource: function() {
			if (!this.hasSchemaError) {
				this.parseSchema()
			} else {
				console.log("loaded schema contains errors, not parsing")
			}
		},
	},
	created() {
		//console.log("hasSchemaError:", this.hasSchemaError, typeof this.hasSchemaError)
		/*
		this.loadSchema(this.selectedSchema)
		if (!this.hasSchemaError) {
			this.parseSchema()
		}
		*/
		console.log("vue:", this, this.$data)
	},
}
