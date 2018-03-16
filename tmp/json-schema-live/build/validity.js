'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setValid = exports.addError = exports.checkValid = undefined;

var _config = require('./config.js');

var config = _interopRequireWildcard(_config);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createValid = vueCreateValid;
//import { set as vueSet } from 'vue'


function vueCreateValid(schema) {
	_vue2.default.set(schema, config.sentinel, {
		v: false,
		e: []
	});
}

function jsCreateValid(schema) {
	schema[config.sentinel] = {
		v: false,
		e: []
	};
}

/*
* function setErrors(schema, errors) {
*	schema[config.sentinel] = {
*		v: !(errors && errors.length),
*		e: errors || [],
*	}
* }
*/

function addError(schema, error) {
	if (!(config.sentinel in schema)) createValid(schema);
	schema[config.sentinel].v = false;
	schema[config.sentinel].e.push(error);
}

function setValid(schema, valid) {
	if (!(config.sentinel in schema)) createValid(schema);
	schema[config.sentinel].v = valid;
}

function getValid(schema) {
	return config.sentinel in schema ? schema[config.sentinel].v : false;
}

function checkValid(schema) {
	//if (!(config.sentinel in schema)) return false
	if (!(config.sentinel in schema)) createValid(schema);
	schema[config.sentinel].v = !schema[config.sentinel].e.length;
	return schema[config.sentinel].v;
}

exports.checkValid = checkValid;
exports.addError = addError;
exports.setValid = setValid;