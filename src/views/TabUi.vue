<template>
	<div class="container-fluid">
		<!-- <div>
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new dataset">New</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new">Clone</b-btn>
				</b-button-group>
				<b-input-group size="sm" class="w-25 mx-1" prepend="schema">
					<b-form-select value="fairdata-ui" :options="getTestSchemaNames()" v-model="selectedSchema"></b-form-select>
				</b-input-group>
				<b-input-group size="sm" class="w-25 mx-1" prepend="owner">
					<b-form-select :value="$auth.user ? $auth.user.name : 'you'" :options="[ $auth.user ? $auth.user.name : 'you' ]"></b-form-select>
				</b-input-group>
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Save this dataset">Save</b-btn>
					<b-btn v-b-tooltip.hover title="Ready to publish">Publish</b-btn>
					<b-btn v-b-tooltip.hover title="Back to start page" to="/">Cancel</b-btn>
				</b-button-group>

				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Validate dataset" size="sm" @click="runValidator()"
					  :disabled="unsubscribeFunc !== null">validate</b-btn>
					<b-btn v-b-tooltip.hover title="Validate while editing" size="sm" id="checkbox-live"
					  :pressed="unsubscribeFunc !== null" @change="toggleValidator()" v-model="doLive">live?</b-btn>
				</b-button-group>
			</b-button-toolbar>
		</div> -->

		<h2>Fairdata dataset schema</h2>
		<ul class="nav nav-tabs">
			<!-- TODO: Dynamically build tabs, like before -->
			<li class="nav-item">
				<router-link class="nav-link" to="/new/description">description</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/new/coverage">coverage</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/new/actors">actors</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/new/relations">relations</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/new/files">files</router-link>
			</li>
		</ul>
		<router-view></router-view>

	</div>
</template>

<script>
import testSchemas from '../testschemas.js'
import testSchemaUis from '../testschemas_ui.js'
import testSchemasData from '../testschemas_data.js'
import jsonPointer from 'json-pointer'

import vSchemaTabSelector from '../widgets/v-schema-tab-selector.vue'

//import { schemaToTabs } from '../schema_to_tabs.js'

//import { SchemaValidator, Validator } from '../../tmp/json-schema-live/src/validate.js'

import Validator from '../../vendor/validator/src/validate.js'

export default {
  name: 'tabui',
  data: function() {
    return {
      selectedSchema: '',
      schemaJson: {},
      children: [],
      validity: {
        valid: false,
      },
      value: undefined,
      testdata: '{"latitude": 60.1830097, "longitude": 24.9595227}',
      testdataValid: null,
      dataParseError: '',
      doLive: true,
      unsubscribeFunc: null,
      startTab: 1,
      tabIndex: null,
      validator: null,
      whereisInput: null,
      whereisReply: null,
    }
  },
  methods: {
    /*
		runValidator: function() {
			this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
		},
		*/
    loadSchema: function(schemaName) {
      //this.validator = SchemaValidator(testSchemas[schemaName], this.$store.state.record)
      //console.log("stats:", this.validator.o, this.validator.q, this.validator.v, this.validator.t, this.validator.f)
      //console.log("Q:", testSchemas[schemaName])
      this.$store.commit('loadSchema', testSchemas[schemaName])
      this.schemaJson = testSchemas[schemaName]
      //this.validator = SchemaValidator(this.schemaJson, this.$store.state.record)
      //this.$store.commit('loadSchema', this.schemaJson)
      /*
			const myPlugin = store => {
				// called when the store is initialized
				store.subscribe((mutation, state) => {
					// called after every mutation.
					// The mutation comes in the format of `{ type, payload }`.
					if (mutation.type == "updateValue") {
						SchemaValidator(store.state.schema, store.state.record)
					}
				})
			}
			//this.$store.plugins.push(myPlugin)
			this.$store.plugins = [myPlugin]
			*/

      //this.subscribeValidator()
    },
    subscribeValidator: function() {
      var vm = this
      /*
			this.validator = new Validator(
				this.$store.state.schema,
				this.$store.state.record,
				{
					cb: function(path, e, v) {
						console.log("!!!cb called!!!")
						vm.$store.commit('setState', { path: path, e: e, v: v })
					}
				}
			)
			*/
      this.validator = new Validator(
        this.$store.state.schema,
        this.$store.state.record,
      )
      this.validator.v = this.$store.state.vState
      //console.log("VALIDATOR:", typeof validator, typeof this.validator.validate)
      // store subscribe arguments: mutation, state
      console.log(
        'data == store? (before)',
        this.validator.data == this.$store.state.record,
      )
      this.unsubscribeFunc = this.$store.subscribe(mutation => {
        //console.log(mutation.type)
        //if (mutation.type == "updateValue" || mutation.type == "loadData") {
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
          //if (validator.data != this.$store.state.record) {
          //	validator.data = this.$store.state.record
          //}
          //validator.schema = this.$store.state.schema
          /*
					SchemaValidator(this.$store.state.schema, this.$store.state.record)
					console.log(mutation.type, SchemaValidator.o, SchemaValidator.q, SchemaValidator.v, SchemaValidator.t, SchemaValidator.f)
					this.$store.commit('updateStats', {
						total: SchemaValidator.v,
						pass: SchemaValidator.t,
						fail: SchemaValidator.f,
						q: SchemaValidator.q,
					})
					*/
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
    /*
		tabChanged: function(index) {
			console.log("tabChanged event:", index)
			this.activeTab = index
		},
		*/
  },
  computed: {
    tabs() {
      return this.$store.state.hints.tabs || ['metadata']
    },
  },
  watch: {
    selectedSchema: function() {
      if (!this.selectedSchema) {
        console.log('selectedSchema triggered without schema!')
        return
      }

      //this.$children.forEach(child => child.$destroy())
      this.loadSchema(this.selectedSchema)
      this.loadUi(this.selectedSchema)
      //this.subscribeValidator()
      this.loadData(this.selectedSchema)
      this.$store.commit('resetState')
      this.subscribeValidator()
      this.$store.watch(
        () => this.$store.state.record,
        value => {
          console.log('store watcher: record changed')
          //this.validator.data = value
          //this.validator.validate()
        },
      )
      //this.validator = SchemaValidator(this.$store.state.schema, this.$store.state.record)
      //let tabs = []
      //schemaToTabs(this.schemaJson, uiHints, tabs)
      //console.log("tab array:", tabs)
    },
    schemaJson: function() {
      console.log('schemaJson watcher ran')
    },
  },
  components: {
    'schema-tab-selector': vSchemaTabSelector,
  },
  created() {
    //console.log("v-schema-schema:", this, this.$data)
    //console.log("$root:", this.$root)
    //console.log("$store:", this.$store)
  },
  mounted() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      console.warn('tabui mounted triggered: READY')
    })
  },
}
</script>
<style>
.nav-tabs .nav-link.active,
.nav-tabs .nav-link.router-link-active,
.nav-tabs .nav-item.show .nav-link {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}
</style>