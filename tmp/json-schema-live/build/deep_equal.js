'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// see also:
// https://www.npmjs.com/package/deep-equal
// https://www.npmjs.com/package/deep-is

// WARNING: This is meant for json-schema data only:
//          floats != integers
// WARNING: not implemented; there seems to be some disagreement on the enum implementation in the json-schema spec,
//          like if 0 == 0.0
function deep_equal(a, b) {
	throw new Error("Not implemented");
	if (typeof a == 'number' && typeof b == 'number') {}

	if (a === b) return true;

	if (!a || !b || (typeof a === 'undefined' ? 'undefined' : _typeof(a)) != 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) != 'object') return a === b;
}