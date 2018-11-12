<template>
	<b-modal size="lg" id="modal1" :title="isInEditMode ? 'Edit Agent' : 'Add Agent'" :visible="value" :ok-disabled="agentType === null || agentRole === null" @change="e => $emit('input', e)" @ok="submit">
		<div class="mb-2">
			<p>Select the type of agent:</p>
			<b-form-select  v-model="agentType" :options="agentTypeOptions" :disabled="isInEditMode"/>
		</div>
		<div v-if="agentType" class="mb-5">
			<p>Select the role of agent:</p>
			<b-form-select  v-model="agentRole" :options="agentRoleOptions" :disabled="isInEditMode"/>
		</div>
		<Person v-if="agentType === 'person'" :edit="isInEditMode" v-model="person" />
		<Organization v-if="agentType === 'organization'" :edit="isInEditMode" v-model="organization" />
	</b-modal>
</template>

<script>

import Person from './Person.vue';
import Organization from './Organization';

export default {
	name: 'agent',
	components: {
		Person,
		Organization,
	},
	props: {
		value: {
			type: Boolean, // the control to show modal
		},
		editableAgent: {
			type: Object,
			required: false
		},
	},
	data() {
		return {
			agentType: null,
			agentTypeOptions: [
				{ value: null, text: 'Select type of the Agent' },
				{ value: 'person', text: 'Person' },
				{ value: 'organization', text: 'Organization' }
			],
			agentRole: null,
			agentRoleOptions: [
				{ value: null, text: 'Select role of the Agent' },
				{ value: 'creator', text: 'Creator' },
				{ value: 'contributor', text: 'Contributor' },
				{ value: 'rights_holder', text: 'Rights holder' },
				{ value: 'curator', text: 'Curator' }
			],
			person: { type: 'person' },
			organization: { type: 'organization' },
		};
	},
	methods: {
		submit() {
			if (this.isInEditMode) {
				this.$emit('edit', { field: this.agentRole, ...this.selectedAgent });
			} else {
				this.$emit('add', { field: this.agentRole, ...this.selectedAgent });
			}
		}
	},
	computed: {
		selectedAgent() {
			switch (this.agentType) {
				case 'person': return this.person;
				case 'organization': return this.organization;
				default: return null;
			}
		},
		isInEditMode() {
			return !!this.editableAgent;
		}
	},
	watch: {
		value(val) {
			// reset agent values when modal is toggled off
			this.person = { type: 'person' };
			this.organization = { type: 'organization' };
			this.agentType = null;
			this.agentRole = null;

			// toggled on and editable agent is defined set values based on it
			if (this.editableAgent && val) {
				this.agentType = this.editableAgent.type;
				this.agentRole = this.editableAgent.field;

				if (this.agentType === 'person') {
					this.person = Object.assign({}, this.editableAgent);
				} else {
					this.organization = Object.assign({}, this.editableAgent);
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
