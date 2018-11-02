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

			<template slot="field" slot-scope="row">
				{{ getFieldName(row) }}
			</template>

			<template slot="actions" slot-scope="row">
				<div class="agent__edit" @click="editAgent(row)"><i title="edit" class="edit-icon fa fa-edit"></i></div>
				<div class="agent__delete" @click="deleteAgent(row)"><i title="delete" class="fa fa-trash-alt"></i></div>
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
		<!--<b-modal v-model="showAddObjectModal" size="lg" id="modal1" title="Add object">
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
		</b-modal>-->
	</div>
</template>

<script>
//import vSchemaBase from '../widgets/v-schema-base.vue'
/*
:schema="$store.state.schema"
path=""
:parent="$store.state"
property="record"
:value="$store.state.record"
:activeTab="$route.params.tab"
:depth="0">
*/
export default {
	name: 'agent-view',
	data() {
		return {
			showAddObjectModal: false,
			// selectedTypeIndex: null,
		}
	},
	methods: {
		/*initializeDataStructure: function() {
			if (this.value !== undefined) {
				return;
			}
			let target, key // eslint-disable-line no-unused-vars

			// the parent of the root path is the store
			if (this.parent === undefined || this.parent === "") {
				console.log("setting parent to store")
				target = this.$store.state
				key = 'record'
			} else {
				console.log("setting parent to parameter")
				target = this.parent
				key = this['property']
			}

			this.$store.commit('initValue', { p: this.parent, prop: this.property, val: {} })
		},*/
		getSelectedIndex(row) {
			// returns index of selected item in its original array
			const indexInFieldArray = items
				.filter(item => item.field === row.field)
				.findIndex(item => item.identifier === row.identifier);

		},
		editAgent(row) {
			const index = getSelectedIndex(row);
			// TODO: edit system
		},
		deleteAgent(row) {

		},
		getName(source) {
			const isOrganization = typeof source.name === 'object';
			if (isOrganization) {
				const keys = Object.keys(source.name);
				if (keys.length === 0) return ''; // name not defined

				const priorityLanguages = ['fi', 'en', 'sv', keys[0]]; // languages to prioritize in displaying
				const langKey = priorityLanguages.filter(key => key in source)[0]
				return `${langKey}: ${source.name[langKey]}`;
			} else { // is person
				return source.name;
			}
		},
		getFieldName(source) {
			switch(source.field) {
				case 'creator': return 'Creator';
				case 'contributor': return 'Contributor';
				case 'rights_holder': return 'Rights Holder';
				case 'curator': return 'Curator';
				default: 'Not defined';
			}
		}
	},
	computed: {
		creators() {
			return this.$store.state.record.creator.map(value => ({
				...value, field: 'creator'
			}));
		},
		curators() {
			return this.$store.state.record.curator.map(value => ({
				...value, field: 'curator'
			}));
		},
		contributors() {
			return this.$store.state.record.contributor.map(value => ({
				...value, field: 'contributor'
			}));
		},
		rightsHolders() {
			return this.$store.state.record.rights_holder.map(value => ({
				...value, field: 'rights_holder'
			}));
		},
		items() {
			const list = [
				...this.creators,
				...this.curators,
				...this.contributors,
				...this.rightsHolders,
			].map((value, index) => ({
				index,
				field: value.field,
				identifier: value.identifier,
				name: this.getName(value),
				email: value.email,
				phone: value.telephone[0],
			}));

			return list;
		},
		fields() {
			// fields for organization AND person
			return ['index', 'valid', 'field','identifier', 'name', 'email', 'phone', 'actions'];
		}
	},
}
</script>

<style lang="scss" scoped>
.new-button {
	float: right;
}

.agent__edit {
	display: inline-block;
}
.agent__delete {
	display: inline-block;
}
</style>
