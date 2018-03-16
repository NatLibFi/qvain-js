Vue.component('json-input', {
  template: '\
  <div>\
  <input\
  	ref="input"\
   	v-bind:class="{ dirty: isDirty }"\
  	v-bind:value="format(value)"\
    v-on:input="parse($event.target.value)"\
    >\
  <hr>\
  isDirty: {{ isDirty }}\
  <br>\
  isObject: {{ isObject }}\
  <br>\
  isBoolean: {{ isBoolean }}\
  <br>\
  isNumber: {{ isNumber }}\
  <br>\
	isString: {{ isString }}\
  <ul v-for="child in children">\
    <li v-for="(v, k) in child">\
      {{ k }}:\
      <json-input label="k" v-model="child[k]"></json-input>\
    </li>\
  </ul>\
  </div>\
  ',

  props: {
    // The form label/key
    label: {
      type: String,
      required: true
    },
    // The form value
    value: {
      required: true
    }
  },

  data() {
    return {
      // dirty is true if the type of the field doesn't match the original
      // value passed.
      dirty: false,
      // typeChecked is true when the type of the original value has been
      // checked. This allows us to validate user-input against the original
      // (expected) type.
      typeChecked: false,
      isObject: false,
      isBoolean: false,
      isNumber: false,
      isString: false,
      children: [],
    }
  },
  computed: {
    isDirty: function() {
      return this.dirty
    }
  },
  methods: {
    // init determines the JS type of the field (once) during initialization.
    init: function() {
      this.typeChecked = false
      this.isObject = false
      this.isBoolean = false
      this.isNumber = false
      this.isString = false
      if (_.isPlainObject(this.value) || _.isArrayLikeObject(this.value)) {
        this.isObject = true
        this.children.push(this.value)
        console.log(this.children)
      } else if (_.isNumber(this.value)) {
        this.isNumber = true
      } else if (_.isBoolean(this.value)) {
        this.isBoolean = true
      } else if (_.isString(this.value)) {
        this.isString = true
      }
      this.typeChecked = true
    },
    // format returns a formatted value based on its type; Objects are
    // JSON.stringify'ed, and Boolean & Number values are noted to prevent
    // reading them back as strings.
    format: function() {
      // Check the types of our fields on the initial format.
      if (!this.typeChecked) {
        this.init()
      }
      var res
      if (this.isObject) {
        res = JSON.stringify(this.value)
      } else if (this.isNumber) {
        res = this.value
      } else if (this.isBoolean) {
        res = this.value
      } else if (this.isString) {
        res = this.value
      } else {
        res = JSON.stringify(this.value)
      }
      return res
    },
    
    // Based on custom component events from
    // https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events
    parse: _.debounce(function(value) {
      this.dirty = false
      if (this.isObject) {
        var res
        try {
          res = JSON.parse(value)
          this.$emit("input", this.format(res))
        } catch (e) {
          // Mark the field as dirty.
          this.dirty = true
          res = value
        }
        this.$emit("input", res)
        return
      }
      // Check the original type of the value; if the user-input does not conform
      // flag the field as dirty.
      if (this.isBoolean) {
        if (value === "true" || value === "false") {
          this.dirty = false
            // Convert back to a Boolean.
          this.$emit("input", (value === "true"))
          return
        }
        this.dirty = true
        this.$emit("input", value)
        return
      } else if (this.isNumber) {
        // Convert numbers back to numbers.
        let num = _.toNumber(value)
        if (_.isNumber(num) && _.isFinite(num)) {
          this.$emit("input", num)
          return
        }
        this.dirty = true
        this.$emit("input", value)
        return
      } else {
        // Write other types as-is.
        this.$emit("input", value)
        return
      }
    }, 1000)
  }
})

new Vue({
    el: '#app',
    data: {
      obj: {
        "count": 555,
        "obj": {
        	"f1": "a",
          "f2": "b",
        }
      }
    },
    methods: {
    	set: function() {
      	this.obj.obj.f2 = "boo"
      },
    },
  })
  ()

