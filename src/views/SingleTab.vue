<template>
  <component is="schema-tab-selector" :schema="schemaJson" path="" :parent="$store.state"
    property="record" :value="$store.state.record" :tab="1" :activeTab="$route.params.tab"
    :depth="0">
  </component>
</template>

<script>
import jsonPointer from 'json-pointer'

import testSchemas from '../testschemas.js'
import testSchemaUis from '../testschemas_ui.js'
import testSchemasData from '../testschemas_data.js'
import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'
import Validator from '../../vendor/validator/src/validate.js'

export default {
  name: 'singletab',
  data: function() {
    return {
      // predefined schema name, this can be defined in a selection screen
      schemaName: 'fairdata-ui-tabs',
      schemaJson: {},
      unsubscribeFunc: null,
      validator: null,
      whereisInput: null,
      whereisReply: null,
    }
  },
  methods: {
    // TODO: run loadAll only initially, maybe in store. Now runs on each tab change
    loadAll: function() {
      this.loadSchema(this.schemaName)
      this.loadUi(this.schemaName)
      this.loadData(this.schemaName)
      // Do not reset here
      // this.$store.commit('resetState')
      this.subscribeValidator()
      this.$store.watch(
        () => this.$store.state.record,
        value => {
          console.log('store watcher: record changed')
        },
      )
    },
    loadSchema: function(schemaName) {
      this.$store.commit('loadSchema', testSchemas[schemaName])
      this.schemaJson = testSchemas[schemaName]
    },
    loadUi: function(schemaName) {
      if (schemaName in testSchemaUis) {
        this.$store.commit('loadHints', testSchemaUis[schemaName])
        console.log('loaded ui for schema:', schemaName)
      } else {
        this.$store.commit('loadHints', {})
        console.log('no ui for schema:', schemaName)
        this.startTab = 1
      }
    },
    loadData: function(schemaName) {
      //this.$store.commit('loadData', {})
      if (schemaName in testSchemasData) {
        this.testdata = JSON.stringify(testSchemasData[schemaName], null, 2)
      }
      // this.$store.commit('loadData', undefined)
      console.log('reset store data')
    },
    // TODO: this is probably not the right place for the validator. Maybe the TabUi page?
    subscribeValidator: function() {
      var vm = this
      this.validator = new Validator(
        this.$store.state.schema,
        this.$store.state.record,
      )
      this.validator.v = this.$store.state.vState
      this.unsubscribeFunc = this.$store.subscribe(mutation => {
        if (
          mutation.type == 'updateValue' ||
          mutation.type == 'pushValue' ||
          mutation.type == 'popValue'
        ) {
          console.warn(
            'data == store?',
            vm.validator.data == vm.$store.state.record,
          )
          if (vm.validator.data !== vm.$store.state.record) {
          }
          vm.validator.validateData(vm.$store.state.record)
        }
      })
    },
    unsubscribeValidator: function() {
      this.unsubscribeFunc()
      this.unsubscribeFunc = null
    },
    toggleValidator: function() {
      this.unsubscribeFunc === null
        ? this.subscribeValidator()
        : this.unsubscribeValidator()
    },
    whereis: function() {
      //this.whereisReply = 1
      if (!this.$store.state.schema) {
        this.whereisReply = "I don't know"
        return
      }

      if (!this.$store.state.hints.tabs) {
        this.whereisReply = 'probably in tab 1'
        return
      }

      let ui = this.$store.state.hints
      let tab = this.startTab

      for (let el in jsonPointer.parse(this.whereisInput)) {
        if (el in ui) {
          if ('tab' in ui.el) {
            tab = ui.el.tab
          }
          ui = ui[el]
        }
      }

      this.whereisReply = tab
    },
  },
  computed: {
    tabs() {
      return this.$store.state.hints.tabs || ['metadata']
    },
  },
  components: {
    'schema-tab-selector': vSchemaTabSelector,
  },
  created() {
    this.loadAll()
  },
}
</script>
