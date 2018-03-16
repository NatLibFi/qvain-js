function parsePath(path) {
	if (path === "") return [];
	if (path[0] !== "/") throw new Error("invalid path:" + path);
	return path.substring(1).split(/\//).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function getPath(obj, path) {
	var els = parsePath(path)
	
	for (var i = 0; i < els.length; ++i) {
		var el = els[i];
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

function getParent(obj, path) {
	var els = parsePath(path)
	
	console.log("len:", els.length)
	
	for (var i = 0; i < els.length - 1; ++i) {
		var el = els[i];
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el);
		}
		obj = obj[el];
	}
	return obj;
}

export { getPath }
