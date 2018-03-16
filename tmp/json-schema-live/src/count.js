import { foreachSchema } from './walk.js'

import { default as testSchemas } from './testschemas.js'




var testSchema = testSchemas['tabs2']

var min = 0
var max = 0

function printPaths(path, schema) {
	console.log(path)
}


foreachSchema(testSchema, printPaths)
