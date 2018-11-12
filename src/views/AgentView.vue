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
				<div class="agent__edit" @click="setEditableAgent(row)"><i title="edit" class="edit-icon fa fa-edit"></i></div>
				<div class="agent__delete" @click="deleteAgent(row)"><i title="delete" class="fa fa-trash-alt"></i></div>
			</template>
		</b-table>
		<Agent v-model="showAddObjectModal"
			:editable-agent="agentUnderEdit"
			:property="property"
			@add="addAgent"
			@edit="editAgent"/>
	</div>
</template>

<script>
import Agent from '../components/Agent.vue';

/* TODO:
- Validations (single item and array level)
- Validation linked to schema
- Agents linked to schema (filtered)

*/
export default {
	name: 'agent-view',
	components: {
		Agent
	},
	data() {
		return {
			showAddObjectModal: false,
			agentUnderEdit: null, // contains the selected agent to be edited. Set from setEditableAgent
			property: null, // watch showAddObject and null everytime? if null on open show multiselect about the agent contri or creator or etc
			agentItems: [] // holds agent as they are in store, do not directly show these, use items
		}
	},
	methods: {
		loadItemsFromStore() {
			this.agentItems = [
				...this.$store.state.record.creator.map(value => ({ ...value, field: 'creator' })),
				...this.$store.state.record.curator.map(value => ({ ...value, field: 'curator' })),
				...this.$store.state.record.contributor.map(value => ({ ...value, field: 'contributor' })),
				...this.$store.state.record.rights_holder.map(value => ({ ...value, field: 'rights_holder' }))
			];
		},
		setValueToStore(property, val) {
			// need property (the array which item belongs to), parent (the record), value (the new array to be placed in )
			this.$store.commit('updateValue', { p: this.$store.state.record, prop: property, val })
		},
		addAgent(agent) {
			console.log('addAgent', agent);
			this.setValueToStore(agent.field, [...this.$store.state.record[agent.field], agent]);
			this.loadItemsFromStore(); // after updating store, load values again
		},
		setEditableAgent(row) {
			// replaced with corresponding element from store elements instead of using those element ment for display
			// NOTE: THIS WILL BREAK IF IDENTIFIER IS NOT UNIQ
			this.agentUnderEdit = this.agentItems.filter(item => item.identifier === row.item.identifier)[0];
			if (this.agentUnderEdit) {
				this.showAddObjectModal = true;
			} else {
				console.warn('could not find editable agent due to mismatch in identifier');
			}

		},
		editAgent(agent) {
			const agentsOfField = [...this.$store.state.record[agent.field]]; // takes a copy
			const editedAgent = agentsOfField.find(a => a.identifier === agent.identifier)
			Object.assign(editedAgent, agent) // modifies the agent in agentsOfField

			this.setValueToStore(agent.field, agentsOfField);
			this.loadItemsFromStore();
		},
		deleteAgent(row) {
			console.log('delete', row);
			const agents = this.$store.state.record[row.item.field]
				.filter(a => a.identifier !== row.item.identifier);

			this.setValueToStore(row.item.field, agents);
			this.loadItemsFromStore(); // after updating store, load values again
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
			switch(source.item.field) {
				case 'creator': return 'Creator';
				case 'contributor': return 'Contributor';
				case 'rights_holder': return 'Rights Holder';
				case 'curator': return 'Curator';
				default: return 'Not defined';
			}
		}
	},
	computed: {
		items() {
			const list = this.agentItems.map((value, index) => ({
				index,
				field: value.field,
				identifier: value.identifier,
				name: this.getName(value),
				email: value.email,
				phone: value.telephone ? value.telephone[0] : 'Not defined',
			}));

			return list;
		},
		fields() {
			// fields for organization AND person
			return ['index', 'valid', 'field','identifier', 'name', 'email', 'phone', 'actions'];
		}
	},
	created() {
		// load items when component is created
		this.loadItemsFromStore();
	}
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
