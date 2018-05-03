import * as config from './config.js'
//import { set as vueSet } from 'vue'
import vue from 'vue'

var createValid = vueCreateValid

function vueCreateValid(schema) {
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


function addError(schema, error) {
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = false
	schema[config.sentinel].e.push(error)
}


function resetErrors(schema) {
	if (config.sentinel in schema && 'e' in schema[config.sentinel]) {
		schema[config.sentinel].e.splice(0, schema[config.sentinel].e.length)
	}
}


function setValid(schema, valid) {
	if (!(config.sentinel in schema)) createValid(schema)
	if (schema[config.sentinel].v !== valid) {
		schema[config.sentinel].v = valid
	}
}


function getValid(schema) {
	return config.sentinel in schema ? schema[config.sentinel].v : false
}


function checkValid(schema) {
	//if (!(config.sentinel in schema)) return false
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = !schema[config.sentinel].e.length
	return schema[config.sentinel].v
}


export { checkValid, addError, resetErrors, setValid }
