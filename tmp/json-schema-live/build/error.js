'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// implement custom errors, so we can separate our own from Javascript's in try/catch handling
function SchemaError(message, path) {
	this.name = 'SchemaError';
	this.message = message || "unspecified error";
	this.path = path || '';

	//if (path) this.message += ' at path ' + path
	if (path) this.message += " (ref: " + path + ")";

	if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);else this.stack = new Error().stack;
}
SchemaError.prototype = Object.create(Error.prototype);
SchemaError.prototype.constructor = SchemaError;

exports.default = SchemaError;