const printContainers = false
const printShortValues = false
const printValues = true

function walkjson(json, logger) {
	this.logger = logger || function() {}
	
	this.walk("", json)
}


walkjson.prototype.handleValue = function(path, val) {
	let log = this.logger
	
	if (printShortValues) {
		/*
		let i = path.lastIndexOf('/')
		if (i >= 0 && i < path.length) {
			path = path.slice(i+1)
		}
		*/
		path = "  " + path.substring(path.lastIndexOf('/')+1)
	}
	
	if (!printValues) {
		log(path)
		return
	}
	
	if (val === null) {
		let newpath = path + '=' + 'null'
		//console.log(newpath)
		log(newpath)
		return
	}
	
	if (val === undefined) {
		let newpath = path + '=' + 'undefined'
		//console.log(newpath)
		log(newpath)
		return
	}
	
	if (typeof val === 'boolean') {
		let newpath = path + '=' + thing
		//console.log(newpath)
		log(newpath)
		return
	}
	
	if (typeof val === 'string' || val instanceof String) {
		let newpath = path + '="' + val + '"'
		//console.log(newpath)
		log(newpath)
		return
	}
	
	if (typeof val === 'number') {
		let newpath = path + '=' + val
		//console.log(newpath)
		log(newpath)
		return
	}
	
	let newpath = path + '=' + val
	//console.log(newpath)
	log(newpath + ' <unknown>')
	return
}


walkjson.prototype.walk = function(path, thing) {
	let log = this.logger
	/*
	 if (thing === null) {
		let newpath = path + 'null'
		console.log(newpath)
		return
	}

	if (thing === undefined) {
		let newpath = path + 'undefined'
		console.log(newpath)
		return
	}
	*/
	
	// arrays are objects too, so check for arrays first!
	if (thing instanceof Array) {
		if (printContainers) { log(path + " <array>") }
		
		for (let i=0; i < thing.length; i++) {
			let newpath = path + '/[' + i + ']'
			//if (printContainers) { log(newpath + " <array>") }
			walk(newpath, thing[i])
		}
		if (thing.length < 1) {
			let newpath = path + '/()'
			//console.log(newpath)
			log(newpath)
		}
		return
	}
	
	// objects that are not arrays
	if (typeof thing === 'object' && !(thing instanceof String)) {
		if (printContainers) { log(path + " <object>") }
		
		for (let key in thing) {
			//let newpath = path + '/{' + key + '}'
			let newpath = path + '/' + key
			//if (printContainers) { log(newpath + " <object>") }
			walk(newpath, thing[key])
		}
		if (Object.keys(thing).length < 1) {
			let newpath = path + '/{}'
			//console.log(newpath)
			log(newpath)
		}
		return
	}
	
	// values
	//console.log(path, "(probably value)")
	handleValue(path, thing)
	return
}

export default walkjson
