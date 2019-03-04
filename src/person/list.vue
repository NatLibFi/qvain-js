<template>
	<div>
		<h2>person-list</h2>
		<p>Person widget test</p>
		<ul>
			<li v-for="(person, i) in people" :key="i">
				<font-awesome-icon :icon="icon.faIdCard" />
				<div v-for="prop in Object.keys(schema.properties)" :key="prop">
					<strong>{{ prop }}:</strong> {{ person[prop] || '–' }}
				</div>
			</li>
		</ul>
		<b-table striped hover :items="people"></b-table>
		<br/>
		<b-modal id="addPersonModal" title="Add a person" size="lg" centered>
			<b-container fluid class="px-0">
				<p>Add a person</p>
				<b-form-group description="Add a person" label="enter your name" :invalid-feedback="invalidFeedback" :valid-feedback="validFeedback" :state="state">
					first name(s):
					<b-input v-model="newFirst"></b-input>
					last name(s):
					<b-input v-model="newLast"></b-input>
					name:
					<b-input v-model="people[editingIndex].name"></b-input>
					email:
					<b-input v-model="people[editingIndex].email"></b-input>
				</b-form-group>
				will be shown as:
				<span class="text-muted">{{ lastFirstName }}</span><br/>
				<div v-if="editingIndex !== null">
					{{ people[this.editingIndex].name }} {{ people[this.editingIndex].email }}
				</div>
				<br/>
				<b-btn @click="add">add</b-btn>
				<b-btn>cancel</b-btn>
			</b-container>
		</b-modal>

		<b-card no-body style="max-width: 60rem;" header-class="">

			<b-navbar slot="header" class="m-0 p-0" toggleable>
				<b-nav-text>
					<h5>Persons</h5>
				</b-nav-text>
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown text="Actions" right>
						<b-dropdown-item v-b-modal.addPersonModal>Add</b-dropdown-item>
						<b-dropdown-item href="#">Add from ORCID</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>
			</b-navbar>

			<b-list-group flush>
				<b-list-group-item v-for="(person, i) in people" :key="i">

					<b-media class="mt-2">
						<font-awesome-icon :icon="icon.faUser" size="lg" fixed-width slot="aside" />
						<b-button-group class="float-right">
							<b-btn :id="`btn-edit-${i}`" variant="dark" @click="open(i)">
								<font-awesome-icon :icon="icon.faUserEdit" fixed-width class="text-light" />
							</b-btn>
							<b-btn :id="`btn-delete-${i}`" variant="danger" @click="remove(i)">
								<font-awesome-icon :icon="icon.faTrashAlt" fixed-width class="text-light" />
							</b-btn>
						</b-button-group>
						<h5 class="mt-0 mb-4">{{ person.name }}</h5>
						<dl class="row my-1" v-for="field in fields" :key="field">
							<dt class="col-sm-2">{{ field }}:</dt>
							<dd class="col-sm-10">{{ person[field] || '–' }}</dd>
						</dl>
					</b-media>

					<div v-if="false">
						<div class="d-flex w-100 justify-content-between my-2">
							<h5 class="mb-1">
								<font-awesome-icon :icon="icon.faUser" fixed-width /> {{ person.name }}</h5>
							<b-button-group class="mt-2">
								<b-btn :id="`btn-edit-${i}`" variant="dark" @click="open(i)">
									<font-awesome-icon :icon="icon.faUserEdit" fixed-width class="text-light" />
								</b-btn>
								<b-btn :id="`btn-delete-${i}`" variant="danger" @click="remove(i)">
									<font-awesome-icon :icon="icon.faTrashAlt" fixed-width class="text-light" />
								</b-btn>
							</b-button-group>
						</div>
						<dl class="row" v-for="field in fields" :key="field">
							<dt class="col-sm-2">{{ field }}:</dt>
							<dd class="col-sm-10">{{ person[field] || '–' }}</dd>
						</dl>
					</div>
				</b-list-group-item>
			</b-list-group>
			<b-card-body v-if="people.length < 1">
				<p class="card-text">
					<i>add a person</i>
				</p>
			</b-card-body>

		</b-card>

		<p>that's all</p>
	</div>
</template>

<script>
import { faIdCard } from '@fortawesome/free-regular-svg-icons'
import {
	faUserEdit,
	faTrashAlt,
	faUser,
} from '@fortawesome/free-solid-svg-icons'

//import PersonComponent from './person.vue'
//import personSchema from './personSchema.json'
import researchAgentSchema from './researchAgentSchema.json'
import testdata from './testdata.json'

//const keyOrder = ['name', 'email', 'telephone', 'identifier']
const keyOrder = ['name', 'email', 'telephone']
const keySet = new Set(keyOrder)

if (researchAgentSchema.properties) {
	Object.keys(researchAgentSchema.properties).forEach(x => keySet.add(x))
}

//console.log("fields:", keySet, keySet.keys(), Array.from(keySet))

export default {
	name: 'person-list',
	data: function() {
		return {
			people: testdata,
			schema: researchAgentSchema,
			firstName: '',
			lastName: '',
			fields: Array.from(keySet),
			newFirst: '',
			newLast: '',
			editingIndex: 0,
			icon: {
				faIdCard,
				faUserEdit,
				faTrashAlt,
				faUser,
			},
		}
	},
	methods: {
		remove(el) {
			this.people.splice(el, 1)
			this.$nextTick(() => this.$el.focus())
			this.$el.focus()
		},
		add() {
			if (!this.newLast) return

			this.people.push({
				name: this.lastFirstName,
			})
			this.editingIndex = null
			this.newFirst = this.newLast = ''
		},
		splitName(fullName) {
			if (fullName) {
				[this.newLast, this.newFirst] = fullName.split(',', 2)
			}
		},
		open(i) {
			this.editingIndex = i
			this.splitName(this.people[i].name)
			this.$root.$emit('bv::show::modal', 'addPersonModal')
		},
	},
	computed: {
		state() {
			if (this.editingIndex === null) {
				return null
			}
			return 'name' in this.people[this.editingIndex] &&
        (this.people[this.editingIndex].name.length > 1 &&
          this.people[this.editingIndex].name.length <= 30)
				? true
				: false
		},
		invalidFeedback() {
			if (this.fullName.length > 30) {
				return 'That looks a bit long for an name...'
			} else if (this.fullName.length < 1) {
				return 'Please enter a name'
			} else {
				return ''
			}
		},
		validFeedback() {
			return this.state ? 'That looks about right!' : ''
		},
		fullName() {
			//return this.newFirst + ' ' + this.newLast
			if (this.editingIndex !== null) {
				return this.people[this.editingIndex].name
			}
			return null
		},
		lastFirstName() {
			return this.newFirst ? this.newLast + ', ' + this.newFirst : this.newLast
		},
	},
}
</script>
