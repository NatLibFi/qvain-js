import * as config from './config.js'
//import { set as vueSet } from 'vue'
import vue from 'vue'

var createValid = vueCreateValid

function vueCreateValid(schema) {
	/*
	const vObj = {}
	Object.defineProperty(vObj, 'v', { value: false, enumerable: false, writable: true, configurable: true })
	Object.defineProperty(vObj, 'e', { value: [], enumerable: false, writable: true, configurable: true })
	*/
	//vue.set(schema, config.sentinel, vObj)
	vue.set(schema, config.sentinel, {
		v: false,
		e: [],
	})
}

function jsCreateValid(schema) {
	schema[config.sentinel] = {
		v: false,
		e: [],
	}
}

/*
* function setErrors(schema, errors) {
*	schema[config.sentinel] = {
*		v: !(errors && errors.length),
*		e: errors || [],
*	}
* }
*/


function addError(path, schema, error) {
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = false
	schema[config.sentinel].e.push(error)
	this.v[path].e.push(error)
	this.v[path].v = false
}

function addHelp(path, help) {
	this.v[path].h = help
}


function resetErrors(path, schema) {
	if (config.sentinel in schema && 'e' in schema[config.sentinel]) {
		schema[config.sentinel].e.splice(0, schema[config.sentinel].e.length)
	}
	//this.v[path].e.splice(0, this.v[path].e.length)
}


function setValid(path, schema, valid) {
	if (!(config.sentinel in schema)) createValid(schema)
	if (schema[config.sentinel].v !== valid) {
		schema[config.sentinel].v = valid
	}
	this.v[path].v = valid
}


/*
function getValid(path, schema) {
	return config.sentinel in schema ? schema[config.sentinel].v : false
}
*/

function checkValid(path, schema) {
	//if (!(config.sentinel in schema)) return false
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = !schema[config.sentinel].e.length
	this.v[path].v = this.v[path].e.length
	return schema[config.sentinel].v
}


export { checkValid, addError, addHelp, resetErrors, setValid }
