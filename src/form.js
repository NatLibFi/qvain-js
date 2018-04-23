// register
var testcomp1 = Vue.component('my-component', {
	template: '<div>A custom component!</div>'
});

var Child = {
	template: '<div>A custom child component!</div>'
}

var Dynamic = {
	render: function (createElement) {
		return createElement(
			'div',
			{},
			[
				createElement('span', 'hello world'),
				Child,
				'(creator: ' + this.creator + ')',
				'(type: ' + this.mytype + ')',
				'(msg: ' + this.message + ')'
			]
		)
	},
	data: function() {
		return {
			"creator": "wouter"
		}
	},
	props: [ "mytype", "message" ]
}


/*
function createComponent(wtype, name) {
	return Vue.component('customWidget', {
		template: '<div>widget: ' + this.name + '</div>',
		data: function() {
			return {
				'type': wtype,
				'name': name
			}
		}
	})
}
*/
function createComponent(wtype, wname) {
	tmp = Vue.extend({
		template: '<div>widget: ' + this.wname + '</div>',
		data: function() {
			return {
				'wtype': wtype,
				'wname': wname
			}
		}
	});
	tmp2 = Vue.component(wname, tmp);
	return tmp2;
}

Vue.component('my-input', {
	template: '\
	<div class="form-group">\
	<label v-bind:for="randomId">{{ label }}:</label>\
	<input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
	</div>\
	',
	props: ['value', 'label'],
	data: function () {
		return {
			randomId: 'input-' + Math.random()
		}
	},
	methods: {
		onInput: function (event) {
			this.$emit('input', event.target.value)
		}
	},
})


var Widget = {
	//template: '<div>A custom widget, named {{name}} (max: {{length}}) <input :name="name" :placeholder="name" v-bind:id="randomId" v-bind:value="value" v-on:input="onInput"></div>',
	template: '<div>A custom widget, named {{name}} (max: {{length}}) <input :name="name" :placeholder="name" :id="randomId" v-bind:value="value" v-on:input="onInput"><button v-on:click="verboseValidate">validate</button>{{ valid }}</div>',
	props: ["name", "length", "value", "validators"],
	data: function() {
		return {
			randomId: 'input-' + Math.random()
		}
	},
	methods: {
		onInput: function (event) {
			//console.log(this, event.target.value);
			this.$emit('input', event.target.value)
		},
		validate: function() {
			//console.log("props1:", 'validators' in this);
			//console.log("props2:", this.validators, typeof this.validators !== 'undefined');
			//if (!('validators' in this.$data) || this.$data.validators.length < 1) {
			if (!('validators' in this) || (typeof this.validators === "undefined") || this.validators.length < 1) {
				console.log("no validators defined");
				return true;
			}
			val = this.value
			len = this.length
			return this.validators.every(function(f) {
				//console.log(typeof f);
				//console.log(val, len, f(val, len));
				/*if (!f(val, len)) {
					return false
				}
				*/
				return f(val, len)
			})
			//console.log("fall-through", val, len, maxlen(val, len));
			//return true
		},
		verboseValidate: function() {
			console.log(this.validate())
		}
	},
	computed: {
		valid: function() {
			//get: this.validate
			//this.isValid = this.validate();
			this.$emit('validity', this.validate());
			return this.validate();
			//return this.isValid;
			//return this.validate();
		}
	}
}

Vue.component('my-widget', {
	//template: '<div>A custom widget, named {{name}} (max: {{length}}) <input :name="name" :placeholder="name" v-bind:id="randomId" v-bind:value="value" v-on:input="onInput"></div>',
	template: '<div class="form-group">\
	A custom widget, named {{name}} (max: {{length}})\
	<input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">\
	</div>',
	props: ["value", "name", "length"],
	data: function () {
		return {
			randomId: 'input-' + Math.random()
		}
	},
	methods: {
		onInput: function (event) {
			this.$emit('input', event.target.value)
		}
	}
})


function maxlen(str, num) {
	return str.length <= num
}

function required(data) {
	if (typeof(data) === 'undefined') {
		return false;
	}
	if (typeof(data) === 'string' && data.length > 0) {
		return true;
	}
	return isNumber(data);
}

function isNumber(o) {
	return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

/* http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
	isNumber ('123'); // true  
	isNumber (5); // true  
	isNumber ('q345'); // false
	isNumber(null); // false
	isNumber(undefined); // false
	isNumber(false); // false
	isNumber('   '); // false
*/

function notNull(q) {
	//if (typeof variable === 'undefined' || variable === null) {
	//	variable is undefined or null
	//}
	return !(typeof variable === 'undefined' || variable === null);
}


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
	schema: {
		"definitions": {
			"author": {
				"type": "string"
			},
			"title": {
				"type": "string"
			},
		},
	},
	mytype: "app",
	type: "wrong",
	sampleElement: '<button v-on="click: test()">Test</button>',
	widgets: [],
	formwidgets: [
		{ type: 'widget', name: 'title', length: '666', value: "", isValid: false },
		{ type: 'widget', name: 'author', length: '5', value: "Franz", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author1', length: '666', value: "Ferdinand1", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author2', length: '666', value: "Ferdinand2", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author3', length: '666', value: "Ferdinand3", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author4', length: '666', value: "Ferdinand4", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author5', length: '666', value: "Ferdinand5", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author6', length: '666', value: "Ferdinand6", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author7', length: '666', value: "Ferdinand7", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author8', length: '666', value: "Ferdinand8", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'author9', length: '666', value: "Ferdinand9", validators: [maxlen], isValid: false },
		{ type: 'widget', name: 'funder1', length: '666', value: "Funder1", validators: [maxlen, required], isValid: false },
		{ type: 'widget', name: 'funder2', length: '666', value: "Funder2", validators: [maxlen, required], isValid: false },
		{ type: 'widget', name: 'number', length: '5', value: "", validators: [maxlen, required, isNumber], isValid: false },
	],
	mywidgets: [
		{ type: 'my-widget', name: 'title', length: '123', value: "2xxx" },
		{ type: 'my-widget', name: 'author', length: '666', value: "Ferdinand" },
	],
	elements: ["a", "b", "c"],
	formValid: false,
	temp: "temporary"
  },
  created: function() {
	  console.log("App created");
  },
  methods: {
	  "parse": function() {
		 console.log("parse called");
		 //this.createElement('div', "parsed");
		 // this.addNewElement();
		 //this.addNewWidget();
		 this.addWidget();
	  },
	  addWidget: function() {
		  this.formwidgets.push({
			  type: 'widget', name: 'funder', length: '15cm'
		})
	  },
	  test: function(){
		  alert('Test');
	  }
  },
  computed: {
	  funcFormValid: function() {
		  return this.formwidgets.map(function(widget) {
			 // console.log(widget.name, ":", widget.isValid);
			  return widget.isValid;
		  }).every(function(validity) {
			return validity;
		})
	}
  },
  components: {
	  'widget': Widget,
	  'my-component': Child,
	  'my-second': {
		 'template': '<div>Second component</div>'
	  },
	  'my-dynamic': Dynamic
  }
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");
});
