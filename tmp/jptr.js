//import jsonPointer from 'json-pointer'
var jsonPointer = require('json-pointer')

var obj = {
	'rights_holder': {
		bla: 'hello'
	}
};

// console.log(jsonPointer.get(obj, '/example/bla'))
console.log(jsonPointer.get(obj, '/rights_holder/bla'))
