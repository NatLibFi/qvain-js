<template>
	<div v-if="false">
		<b-modal :visible="true" size="lg" id="modal1" title="Add object">
			<div v-if="multipleTypes" class="mb-5">
				<p>Select the type of object</p>
				<b-form-select  v-model="selectedTypeIndex" :options="objectTypeOptions" />
			</div>
			<schema-tab-selector v-for="propName in sortedProps" :key="propName"
				:schema="propertiesFromSelectedSchema[propName]"
				:path="newPath('properties/' + propName)"
				:value="value[propName]"
				:parent="value"
				:property="propName"
				:tab="myTab"
				:activeTab="activeTab"
				:depth="depth">
			</schema-tab-selector>
  		</b-modal>
	</div>
	<b-card v-else no-body header-class="with-fd-bg" class="my-3">
		<h2 slot="header">{{ uiTitle }}</h2>

		<b-card-body>
			<p class="card-text text-muted" v-if="uiDescription"><sup><font-awesome-icon icon="quote-left" class="text-muted" /></sup> {{ uiDescription }}</p>
			<b-form-select v-if="multipleTypes" v-model="selectedTypeIndex" :options="objectTypeOptions" class="" />
		</b-card-body>

		<b-list-group flush>
			<!-- b-list-group-item class="border-0" v-for="(propSchema, propName) in schema['properties']" :key="propName" :test="'test-'+propName" -->
			<b-list-group-item class="border-0" v-for="propName in sortedProps" :key="propName">
				<schema-tab-selector
					:key="propName"
					:schema="propertiesFromSelectedSchema[propName]"
					:path="newPath('properties/' + propName)"
					:value="value[propName]"
					:parent="value"
					:property="propName"
					:tab="myTab"
					:activeTab="activeTab"
					:depth="depth">
				</schema-tab-selector>
				<!-- component is="schema-tab-selector" :schema="propSchema" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab" :depth="depth" :key="propName"></component -->
			</b-list-group-item>
		</b-list-group>

	</b-card>
</template>

<style>
div:empty {
	/* background: lime; */
	/* display: none; */
}
</style>

<script>
import vSchemaBase from './v-schema-base.vue'
import keysWithOrder from '@/lib/keysWithOrder.js'

export default {
	extends: vSchemaBase,
	name: 'schema-object',
	description: "generic object",
	schematype: 'object',
	data: function() {
		return {
			q: "not set",
			selectedTypeIndex: null,
		}
	},
	/*
	watch: {
		schema: {
			handler(val) {
				//this.q = this.schema['.q']
				this.q = val['.q'] || "not set 2"
				console.log("OBJECT SCHEMA WATCHER RAN for", this.path, "val:", val)
			},
			deep: true,
		},
	},
	*/
	computed: {
		vState() {
			return this.$store.state.vState
		},
		myState: {
			cache: false,
			get: function() {
				return this.vState[this.path] || {}
			},
		},
		/*
		myState() {
			return this.vState[this.path] || {}
		},
		*/
		multipleTypes() {
			return !!this.schema['oneOf'];
		},
		objectTypeOptions() {
			if (this.multipleTypes) {
				const types = this.schema.oneOf.map((type, index) => ({ value: index, text: type.title }));
				return [{ value: null, text: 'Select type' }, ...types];
			}
			return null;
		},
		propertiesFromSelectedSchema() {
			if (this.multipleTypes && this.selectedTypeIndex !== null) {
				return this.schema.oneOf[this.selectedTypeIndex].properties;
			}
			return this.schema['properties'];
		},
		sortedProps() {
			if (!this.propertiesFromSelectedSchema) {
				console.log("sortedProps(): no props")
				return []
			}

			if (typeof this.ui['order'] === 'object') {
				console.log("sortedProps(): found order:", this.ui['order'])

				return keysWithOrder(this.propertiesFromSelectedSchema, this.ui['order'])
			} else {
				console.log("sortedProps(): props not ordered", Object.keys(this.propertiesFromSelectedSchema));
				return Object.keys(this.propertiesFromSelectedSchema);
			}
		},
	},
	created() {
		//console.log("v-schema-object:", this, this.$data, this.$props)
		//console.log("registered components:", this.$options.components)
		//console.log("object:", this, "path:", this.path, "children:", this.$children, "slots:", this.$slots)
	},
}
</script>
