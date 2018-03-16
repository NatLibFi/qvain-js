// javascript helper functions, export all

export function isObject(thing) {
	return thing !== null && typeof thing === 'object' && !(thing instanceof String || thing instanceof Array || typeof thing === 'function')
}

export var isFinite = Number.isFinite || function(val) {
	return typeof val === 'number' && isFinite(val);
}

export var isInteger = Number.isInteger || function(val) {
	return typeof val === "number" &&
	isFinite(val) &&
	Math.floor(val) === val;
}
