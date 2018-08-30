<template>
	<b-card no-body sub-title="uiDescription" class="my-3">
		<h3 slot="header">
			<font-awesome-icon :icon="icon.faAngleRight" /> {{ uiTitle }}</h3>

		<b-card-body>
			<p class="card-text text-muted" v-if="uiDescription">
				<sup>
					<font-awesome-icon :icon="icon.faQuoteLeft" class="text-muted" />
				</sup> {{ uiDescription }}</p>
		</b-card-body>
		<!-- b-form-group id="" :label-cols="4" :description="uiDescription" :label="uiLabel" :horizontal="true" -->
		<b-list-group flush>
			<b-list-group-item v-for="(child, index) in children" :key="index">
				<!-- style="border-left: 2px solid #aaaaaa; padding-left: 1em; margin-left: 1em;" -->
				<component is="schema-tab-selector" :schema="schemaForChild(index)" :path="newPath(index)" :value="value[index]" :parent="parent[property]" :property="index" :tab="myTab" :activeTab="activeTab" :depth="depth" @delete="deleteElement"></component>
			</b-list-group-item>
			<b-list-group-item v-if="!children || children.length < 1">
				<i>no items</i>
			</b-list-group-item>
		</b-list-group>
		<!-- /b-form-group -->
		<b-card-footer>
			list
			<button type="button" :disabled="this.children.length <= this.minimum" @click="doMinus">-</button> |
			<button type="button" :disabled="this.children.length >= this.maximum" @click="doPlus">+</button>
			(min: {{ minimum }} / max: {{ maximum || '-' }})
		</b-card-footer>

	</b-card>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import vSchemaBase from './v-schema-base.vue'
//import uiComponents from './uicomponents.js'
//import vSchemaSelector from './v-schema-selector.vue'

export default {
  extends: vSchemaBase,
  name: 'schema-inline-array',
  description: 'generic array',
  schematype: 'array',
  data: function() {
    return {
      //children: [],
      minimum: 0,
      maximum: 0,
      icon: {
        faAngleRight,
        faQuoteLeft,
      },
    }
  },
  methods: {
    doMinus: function() {
      // it's safe to pop() a zero-length array
      //if (this.children.length > this.minimum) this.children.pop()
      if (this.value.length > this.minimum)
        this.$store.commit('popValue', {
          p: this.parent,
          prop: this.property,
          val: this.value,
        })
    },
    doPlus: function() {
      //if (this.maximum === undefined || this.children.length < this.maximum) this.children.push('')
      //if (this.maximum === undefined || this.value.length < this.maximum) this.value.push('')
      if (this.maximum === undefined || this.value.length < this.maximum) {
        //this.value.push({})
        this.$store.commit('pushValue', {
          p: this.parent,
          prop: this.property,
          val: this.value,
        })
        return true
      }
      return false
      console.log('didPlus, length now:', this.value.length)
    },
    deleteElement: function(index) {
      console.log(
        'schema-array: request to delete element with index',
        index,
        'value:',
        this.children[index],
      )
      if (index >= 0 && index < this.children.length) {
        this.children.splice(index, 1)
      } else {
        console.log(
          'deleteElement: attempt to remove non-existing element at index',
          index,
        )
      }
    },
    schemaForChild: function(index) {
      if (this.isTuple) {
        var additionalSchema =
          typeof this.schema['additionalItems'] === 'object'
            ? this.schema['additionalItems']
            : {}

        return index < this.schema['items'].length
          ? this.schema['items'][index]
          : additionalSchema
      } else {
        return this.schema['items']
      }
    },
    init: function() {
      this.minimum =
        typeof this.schema['minItems'] === 'number' &&
        this.schema['minItems'] > 0
          ? this.schema.minItems
          : 0
      this.maximum =
        typeof this.schema['maxItems'] === 'number' &&
        this.schema['maxItems'] > 0
          ? this.schema.maxItems
          : undefined
      //console.log("schema-array: set min/max", this.minimum, this.maximum)
      if (this.isTuple && !this.allowAdditional)
        this.maximum = this.schema['items'].length
    },
  },
  computed: {
    isTuple: function() {
      // list or tuple validation?
      return this.schema['items'] instanceof Array
    },
    allowAdditional: function() {
      // additionalItems: true if missing, true if true, true when object; false if false
      return this.schema['additionalItems'] !== false
    },
    children: {
      cache: false,
      get: function() {
        return this.value
      },
    },
  },
  watch: {
    schema: function() {
      return this.init()
    },
  },
  created() {
    return this.init()
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
