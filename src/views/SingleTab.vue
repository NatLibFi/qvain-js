<template>
  <component is="schema-tab-selector" :schema="schemaJson" path="" :parent="$store.state"
    property="record" :value="$store.state.record" :tab="1" :activeTab="$route.params.tab"
    :depth="0">
  </component>
</template>

<script>
import testSchemas from '../testschemas.js'
import testSchemaUis from '../testschemas_ui.js'
import testSchemasData from '../testschemas_data.js'
import jsonPointer from 'json-pointer'

import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'

import Validator from '../../vendor/validator/src/validate.js'

export default {
  name: 'singletab',
  data: function() {
    return {
      schemaName: 'fairdata-ui-tabs',
      schemaJson: {},
      children: [],
      validity: {
        valid: false,
      },
      value: undefined,
      dataParseError: '',
      doLive: true,
      unsubscribeFunc: null,
      validator: null,
      whereisInput: null,
      whereisReply: null,
    }
  },
  methods: {
    loadSchema: function(schemaName) {
      this.$store.commit('loadSchema', testSchemas[schemaName])
      this.schemaJson = testSchemas[schemaName]
    },
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
          if (vm.validator.data !== vm.$store.state.record) {
            console.warn(
              'data == store?',
              vm.validator.data == vm.$store.state.record,
            )
          }
          console.log('validator ran')
          vm.validator.validateData(vm.$store.state.record)
          //console.warn("data == store? (after validate)", vm.validator.data == vm.$store.state.record, vm.validator.data, vm.$store.state.record)
        }
      })
      //console.log("store:", this.$store, unsubscribe)
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
      this.$store.commit('loadData', undefined)
      console.log('reset store data')
    },
    loadAll: function() {
      this.loadSchema(this.schemaName)
      this.loadUi(this.schemaName)
      this.loadData(this.schemaName)
      this.$store.commit('resetState')
      this.subscribeValidator()
      this.$store.watch(
        () => this.$store.state.record,
        value => {
          console.log('store watcher: record changed')
        },
      )
    },
    mergeJson: function() {
      var json = ''
      try {
        json = JSON.parse(this.testdata)
      } catch (e) {
        this.dataParseError = e.message
        test.testdataValid = false
        return
      }
      this.dataParseError = ''
      this.testdataValid = true
      this.$store.commit('mergeData', json)
    },
    getTestSchemaNames: function() {
      return Object.keys(testSchemas)
    },
    parseJson: function() {
      console.log('clicked parse button!')
      try {
        var tmp = JSON.parse(this.testdata)
      } catch (e) {
        this.dataParseError = e.message
        this.testdataValid = false
        console.log('testdata: NOT E')
        console.log('testdata:', e)
        console.log(
          'testdata error:',
          this.dataParseError,
          this.dataParseError.length,
        )
        return
      }
      this.dataParseError = ''
      this.testdataValid = true
      this.value = tmp
      this.$store.commit('loadData', tmp)
    },
    getJson: function() {
      this.testdata = JSON.stringify(this.$store.state.record || '', null, 2)
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
  watch: {
    // selectedSchema: function() {
    //   if (!this.selectedSchema) {
    //     console.log('selectedSchema triggered without schema!')
    //     return
    //   }
    //   this.loadSchema(this.selectedSchema)
    //   this.loadUi(this.selectedSchema)
    //   this.loadData(this.selectedSchema)
    //   this.$store.commit('resetState')
    //   this.subscribeValidator()
    //   this.$store.watch(
    //     () => this.$store.state.record,
    //     value => {
    //       console.log('store watcher: record changed')
    //       //this.validator.data = value
    //       //this.validator.validate()
    //     },
    //   )
    //   //this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
    //   //let tabs = []
    //   //schemaToTabs(this.schemaJson, uiHints, tabs)
    //   //console.log("tab array:", tabs)
    // },
    schemaJson: function() {
      console.log('schemaJson watcher ran')
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
