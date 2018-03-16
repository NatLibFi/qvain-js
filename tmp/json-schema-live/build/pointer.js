"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function parsePath(path) {
	if (path === "") return [];
	if (path[0] !== "/") throw new Error("invalid path:" + path);
	return path.substring(1).split(/\//).map(function (s) {
		return s.replace(/~1/g, '/').replace(/~0/g, '~');
	});
}

function getPath(obj, path) {
	var els = parsePath(path);

	for (var i = 0; i < els.length; ++i) {
		var el = els[i];
		if (!((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

function getParent(obj, path) {
	var els = parsePath(path);

	console.log("len:", els.length);

	for (var i = 0; i < els.length - 1; ++i) {
		var el = els[i];
		if (!((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

exports.getPath = getPath;