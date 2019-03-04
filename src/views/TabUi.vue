<template>
	<div class="container-fluid my-4">
		<h2>Fairdata dataset schema</h2>
		<ul class="nav nav-tabs">
			<!-- TODO: errors could be shown in tabs also -->
			<li v-for="tab in tabs" :key="tab.uri" class="nav-item">
				<router-link class="nav-link" :to="`/new/${tab.uri}`">{{tab.label}}</router-link>
			</li>
		</ul>
		<router-view></router-view>
	</div>
</template>

<script>
import testSchemas from '../testschemas.js'
import testSchemaUis from '../testschemas_ui.js'
import testSchemasData from '../testschemas_data.js'
import Validator from '../../vendor/validator/src/validate.js'

export default {
	name: 'tabui',
	data: function() {
		return ({
			// predefined schema name, this can be defined in a selection screen
			schemaName: 'fairdata-ui-tabs',
			unsubscribeFunc: null,
			validator: null,
		})
	},
	methods: {
		// TODO: run loadAll only initially, maybe in store. Now runs on each tab change
		loadAll: function() {
			this.loadSchema(this.schemaName)
			this.loadUi(this.schemaName)
			this.loadData(this.schemaName)
			// reset?
			this.$store.commit('resetState')
			this.subscribeValidator()
			/*
			this.$store.watch(
				() => this.$store.state.record,
				value => {
					console.log('store watcher: record changed')
				},
			)
			*/
		},
		loadSchema: function(schemaName) {
			this.$store.commit('loadSchema', testSchemas[schemaName])
		},
		loadUi: function(schemaName) {
			if (schemaName in testSchemaUis) {
				this.$store.commit('loadHints', testSchemaUis[schemaName])
			} else {
				this.$store.commit('loadHints', {})
			}
		},
		loadData: function(schemaName) {
			if (schemaName in testSchemasData) {
				this.testdata = JSON.stringify(testSchemasData[schemaName], null, 2)
			}
		},
		// TODO: this is probably not the right place for the validator. Maybe the TabUi page?
		subscribeValidator: function() {
			let vm = this
			this.validator = new Validator(
				this.$store.state.schema,
				this.$store.state.record,
				{
					'allowUndefined': true,
				},
			)
			this.validator.v = this.$store.state.vState
			this.unsubscribeFunc = this.$store.subscribe(mutation => {
				if (
					mutation.type == 'updateValue' ||
					mutation.type == 'pushValue' ||
					mutation.type == 'popValue'
				) {
					console.warn('data == store?', vm.validator.data == vm.$store.state.record)
					//if (vm.validator.data !== vm.$store.state.record) {}
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
	},
	computed: {
		tabs() {
			return this.$store.state.hints.tabs
		},
	},
	created() {
		this.loadAll()
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
