function addError(path, schema, error) {
	this.v[path].e.push(error)
	this.v[path].v = false
}


function addHelp(path, help) {
	this.v[path].h = help
}


function resetErrors(path, schema) {
	//this.v[path].e.splice(0, this.v[path].e.length)
}


function setValid(path, schema, valid) {
	this.v[path].v = valid
}


function checkValid(path, schema) {
	this.v[path].v = !this.v[path].e.length
	return this.v[path].v
}


export { checkValid, addError, addHelp, resetErrors, setValid }
