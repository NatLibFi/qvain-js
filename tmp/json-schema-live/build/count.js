'use strict';

var _walk = require('./walk.js');

var _testschemas = require('./testschemas.js');

var _testschemas2 = _interopRequireDefault(_testschemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testSchema = _testschemas2.default['tabs2'];

var min = 0;
var max = 0;

function printPaths(path, schema) {
	console.log(path);
}

(0, _walk.foreachSchema)(testSchema, printPaths);