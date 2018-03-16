var world = {
	'key': "value",
	'number': 666,
}

function mylog() {
	//var args = Array.prototype.slice.call(arguments, 1);
	var args = Array.prototype.slice.call(arguments);
	return args.map(x => x || ('' + x)).join(' ');
}

for (var key in world) {
	console.log("key:", key, "value:", world[key])
	debugger;
	mylog("key:", key, "value:", world[key])
}
