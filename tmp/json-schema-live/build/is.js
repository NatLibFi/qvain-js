'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
// javascript helper functions, export all

function isObject(thing) {
	return thing !== null && (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object' && !(thing instanceof String || thing instanceof Array || typeof thing === 'function');
}

var isFinite = exports.isFinite = Number.isFinite || function (val) {
	return typeof val === 'number' && isFinite(val);
};

var isInteger = exports.isInteger = Number.isInteger || function (val) {
	return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
};