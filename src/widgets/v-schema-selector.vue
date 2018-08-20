<template>
  <div class="container-fluid">
    <b-button-toolbar v-if="this.$root.DEBUG" aria-label="schema debugging toolbar">
      <b-button-group size="sm" class="mx-1">
        <b-btn @click="showWidgets = !showWidgets">
          <font-awesome-icon :icon="icon.faPencil" />
        </b-btn>
        <b-btn @click="showTypeSelector = !showTypeSelector">
          <font-awesome-icon :icon="icon.faExchangeAlt" />
        </b-btn>
        <b-btn @click="verbose = !verbose">
          <font-awesome-icon :icon="icon.faEye" />
        </b-btn>
      </b-button-group>
    </b-button-toolbar>
    <div v-if="showWidgets">
      <p>ui widgets</p>
      <select v-model="customWidget">
        <option v-for="(constructor, name) in this.$options.components" :key="constructor">{{ name }}</option>
      </select>
    </div>
    <div v-if="showTypeSelector">
      <p>this schema has multiple possible types; please choose one</p>
      <select v-model="valType">
        <option disabled value="">Please select one</option>
        <option v-for="type in schema.type" :key="type">
          {{ type }}
        </option>
      </select>
    </div>
    <b-card v-if="verbose" header="" class="mb-2" title="" sub-title="">
      <p>
        path:
        <code>{{ path || 'root' }}</code><br/> type:
        <code>
          <span v-if="schema.type">{{ schema.type }}</span>
          <span class="meta-info missing" v-else>unknown</span>
        </code><br/> validationType:
        <code>{{ valType }}</code><br/> is:
        <code>{{ widget }}</code><br/> value:
        <code>{{ value }}</code><br/> valid:
        <code>isValid</code><br/> schema:
        <code>{{ schema }}</code><br/>
      </p>

      <small slot="footer" class="text-muted">
      </small>
    </b-card>

    <!-- <h2 v-if="schema.title">{{ schema.title }}</h2><h2 class="metainfo missing" v-else>missing title</h2> -->
    <!-- <h2 :class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2> -->

    <h2 v-if="schema.title">{{ schema.title }}</h2>
    <p v-if="schema.description">{{ schema.description }}</p>

    <!-- actual component -->
    <!-- keep-alive -->
    <component is="widget" :schema="schema" :path="path" :value="value" :valtype="valType" :parent="parent" :property="property" :tab="myTab" v-on="$listeners">
      <p>{{ valType }}</p>
    </component>
    <!-- /keep-alive -->

  </div>
</template>

<script>
import Vue from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faEye,
  faExchangeAlt,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons'

import vSchemaNumber from './v-schema-number.vue'
import vSchemaString from './v-schema-string.vue'
import vSchemaObject from './v-schema-object.vue'
import vSchemaArray from './v-schema-array.vue'
import WidgetGoogleMaps from './widget-googlemaps.vue'
//import refdataList from './refdata/list.vue'

export default {
  name: 'schema-selector',
  description: 'internal dispatch wrapper',
  schematype: 'any',
  /*
	props: {
		schema: Object,
	},
	*/
  props: ['schema', 'value', 'path', 'parent', 'property', 'tab'],
  data: function() {
    return {
      valType: '',
      verbose: false,
      showWidgets: false,
      customWidget: undefined,
      icon: {
        faExchangeAlt,
        faEye,
        faPencil,
      },
    }
  },
  methods: {
    setValType: function(schemaType) {
      if (typeof schemaType === 'object' && schemaType instanceof Array) {
        this.valType = schemaType[0]
      } else {
        this.valType = schemaType
      }
      //this.$emit('typeChanged', this.valType)
    },
    defaultWidget: function(schemaType) {
      switch (schemaType) {
        case 'string':
          return 'schema-string'
        case 'number':
          return 'schema-number'
        case 'integer':
          return 'schema-number'
        case 'object':
          return 'schema-object'
        case 'array':
          return 'schema-array'
        case 'boolean':
          console.log('schema-selector: boolean not implemented yet')
          return ''
        case 'null':
          console.log('schema-selector: null not implemented yet')
          return ''
        case undefined:
          console.log('schema-selector: `any` not implemented yet')
          return ''
        default:
          console.log('schema-selector: unknown schemaType')
          return ''
      }
    },
    vivicate: function() {
      console.log('vivicate():', this.path, 'value:', this.value)

      if (this.value === undefined) {
        console.log('UNDEFINED', this.path)
        var target, key

        if (this.parent === undefined || this.parent === '') {
          console.log('setting parent to store, path:', this.path)
          target = this.$store.state
          key = 'record'
        } else {
          console.log('setting parent to parameter')
          target = this.parent
          key = this['property']
        }

        if (this.schema['type'] === 'object') {
          //this.value = {}
          Vue.set(target, key, {})
          console.log('set value to empty object')
        } else if (this.schema['type'] === 'array') {
          //this.value = []
          Vue.set(target, key, [])
          console.log('set value to empty array')
        }
        /*
				else {
					Vue.Set(target, key, null)
					console.log("set value to null")
				}
				*/
      }
    },
  },
  computed: {
    showTypeSelector: function() {
      // type can be array or string
      return typeof this.schema['type'] === 'object'
    },
    widget: function() {
      //return this.valType ? "schema-" + this.valType : ""
      //return this.defaultWidget(this.valType)
      return this.customWidget || this.defaultWidget(this.valType)
    },
    uiTab: function() {
      return (
        this.$store.state.hints[this.path] &&
        this.$store.state.hints[this.path]['tab']
      )
    },
    myTab: function() {
      console.log('uiTab:', this.uiTab, this.$store.state.hints[this.path])
      return typeof this.uiTab === 'number' ? this.uiTab : this.tab
    },
  },
  watch: {
    schema: function() {
      console.log(
        'schema-selector(',
        this.path,
        '): calling setValType (watch) with',
        this.schema['type'],
      )
      this.setValType(this.schema['type'])

      console.log('calling vivicate() from watcher')
      this.vivicate()

      /*
			console.log("destroying children", this.$children)
			this.$children.forEach(child => child.$destroy())
			console.log("destroyed children", this.$children)
			this.$forceUpdate()
			*/
      this.$children.forEach(child => console.log('child:', child))
      //this.$children = []
      //console.log("set children to empty list", this.$children)
    },
  },
  components: {
    //'schema': vSchemaSchema,
    'schema-number': vSchemaNumber,
    'schema-string': vSchemaString,
    'schema-object': vSchemaObject,
    'schema-array': vSchemaArray,
    'widget-googlemaps': WidgetGoogleMaps,
    //'refdata-list': refdataList,
  },
  created() {
    console.log(
      'schema-selector(',
      this.path,
      '): calling setValType (created) with',
      this.schema['type'],
    )
    this.setValType(this.schema['type'])
    //console.log("config:", this.$root, this.$root.DEBUG)
    //console.log(this.$options.components)
    console.log('calling vivicate() from created()')
    this.vivicate()
  },
}
</script>
