<template>
	<b-card no-body header-class="with-fd-bg" class="my-3">
		<h2 slot="header" @click="visible = !visible" :aria-controls="domId + '-props'" :aria-expanded="visible ? 'true' : 'false'">
			<font-awesome-icon v-if="!visible" :icon="expandArrow" class="text-dark"/> {{ uiTitle }}
		</h2>
		<b-collapse :id="domId + '-props'" v-model="visible">
			<b-card-body>
				<p class="card-text text-muted" v-if="uiDescription"><sup><font-awesome-icon icon="quote-left" class="text-muted" /></sup> {{ uiDescription }}</p>
			</b-card-body>

			<div class="px-3 mb-3" role="tablist" v-for="(org, i) in flattened" :key="'level-' + i">
				<b-card no-body class="mb-1">
					<b-card-header header-tag="header" class="p-1" role="tab">
						<b-btn href="#" v-b-toggle="domId + '-accordion-' + i" variant="link" style="text-align: left;"><font-awesome-icon icon="angle-right" fixed-width /> Level {{ i + 1 }}{{ getDescriptionForLevel(i) }}</b-btn>
						<b-btn v-if="i > 0" class="btn-outline-secondary danger-on-hover border-0" @click="remove(i)"><font-awesome-icon icon="trash" /></b-btn>
					</b-card-header>
					<b-collapse :id="domId + '-accordion-' + i" visible :accordion="domId + '-accordion'" role="tabpanel">
						<b-card-body class="p-0 m-0">
							<FlatObject v-if="true" :schema="schema" :path="path" :value="org" :parent="i ? flattened[i - 1] : value" :property="i ? refField : property" :tab="myTab" :activeTab="activeTab" :depth="depth" :key="'level-' + i"></FlatObject>
						</b-card-body>
					</b-collapse>
				</b-card>
			</div>

			<b-button class="m-3" @click="add()"><font-awesome-icon icon="plus" fixed-width /> Add another level</b-button>

			</b-collapse>
	</b-card>
</template>

<style>
</style>

<script>
import SchemaBase from './base.vue'
import keysWithOrder from '@/lib/keysWithOrder.js'
import jsonPointer from 'json-pointer'

export default {
	extends: SchemaBase,
	name: 'SelfReferentialObject',
	description: "self-referential object",
	schematype: 'object',
	props: {
		'refField': String,
		'levels': Array,
	},
	data: function() {
		return {
			visible: true,
		}
	},
	methods: {
		add() {
			var obj = this.value
			console.log("add() called", obj)
			while (this.refField in obj) {
				obj = obj[this.refField]
			}
			console.log("add() called (after loop)", obj)
			this.$store.commit('updateValue', {
				p: obj,
				prop: this.refField,
				val: {},
			})
			//obj[this.refField] = undefined
			//return obj[this.refField]
		},
		remove(level) {
			// don't allow deleting top level for now
			if (!level) return

			var obj = this.value
			var i = 0
			var parent = this.parent
			while (i !== level && this.refField in obj) {
				parent = obj
				obj = obj[this.refField]
				i++
			}
			if (level === i) {
				this.$store.commit('deleteValue', {
					p: parent,
					// property name of top-level in parent might be different, e.g. memberOf/partOf/partOf/partOf/...
					prop: i == 0 ? this.property : this.refField,
				})
				return
			}
		},
		getDescriptionForLevel(level) {
			return this.levels && this.levels[level] ? ': ' + this.levels[level] : ""
		},
	},
	computed: {
		countLevels() {
			if (!this.value) { return -1 }
			var recurse = this.value
			var depth = 0
			while (this.refField in recurse) {
				depth++
				recurse = recurse[this.refField]
			}
			return depth + 1
		},
		expandArrow() {
			return this.visible ? "ellipsis-v" : "angle-right"
		},
		flattened() {
			var obj = this.value
			var arr = []

			if (!obj || typeof obj !== 'object') return arr

			arr.push(obj)

			while (this.refField in obj) {
				obj = obj[this.refField]
				if (!obj || typeof obj !== 'object') return arr
					arr.push(obj)
			}

			return arr
		},
	},
	watch: {
		value() {
			console.log("SelfReferentialObject(): watcher trigger:", this.flattened)
		},
		"value.email"() {
			console.log("SelfReferentialObject(): email watcher trigger:", this.flattened)
		},
	},
	created() {
		if ('visible' in this.ui) this.visible = this.ui['visible']
	},
}
</script>
