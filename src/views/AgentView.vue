<template>
	<div>
		<b-table show-empty stacked="md" :items="items" :fields="fields" caption-top>
			<template slot="table-caption">
				An agent (eg. person, group, software or physical artifact).
				<b-button class="new-button" variant="primary" @click="showAddObjectModal = true">Add new Agent</b-button>
			</template>

			<template slot="index" slot-scope="row">#{{row.value + 1}}</template>
			<template slot="valid" slot-scope="row">
				<i v-if="row.value" :style="{color: 'green'}" class="far fa-check-circle"></i>
				<i v-else :style="{color: 'red'}" class="fas fa-exclamation-circle"></i>
			</template>
			<template slot="actions" slot-scope="row">
				<i title="edit" class="edit-icon fa fa-edit"></i>
				<i title="delete" class="fa fa-trash-alt"></i>
			</template>
		</b-table>
		<!--<component is="schema-tab-selector"
			:schema="$store.state.schema"
			path=""
			:parent="$store.state"
			property="record"
			:value="$store.state.record"
			:activeTab="$route.params.tab"
			:depth="0">
		</component>-->
		<b-modal v-model="showAddObjectModal" size="lg" id="modal1" title="Add object">
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
</template>

<script>
import vSchemaBase from '../widgets/v-schema-base.vue'

export default {
	extends: vSchemaBase,
	data() {
		return {
			items: [],
			fields: [],
			showAddObjectModal: false,
			selectedTypeIndex: null,
		}
	},
	computed: {
		multipleTypes() {
			if (this.schema) {
				return !!this.schema['oneOf'];
			}
			return false;
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

			/*if (typeof this.ui['order'] === 'object') {
				console.log("sortedProps(): found order:", this.ui['order'])

				return keysWithOrder(this.propertiesFromSelectedSchema, this.ui['order'])
			} else {
				console.log("sortedProps(): props not ordered", Object.keys(this.propertiesFromSelectedSchema));
				return Object.keys(this.propertiesFromSelectedSchema);
			}*/
			return Object.keys(this.propertiesFromSelectedSchema);
		},
	},
	created() {
		console.log(this.props);
	}
}
</script>

