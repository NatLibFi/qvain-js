<template>
	<div :style="listItemStyle">
		<header>
			<h3 class="title" @click="visible = !visible" :aria-controls="domId + '-props'" :aria-expanded="visible ? 'true' : 'false'">
				<!--<font-awesome-icon v-if="!visible" :icon="expandArrow" class="text-dark"/>-->
				{{ uiTitle }}
			</h3>
		</header>
		<section>
			<b-list-group flush>
				<b-list-group-item class="border-0" v-for="propName in sortedProps" :key="propName">
					<component is="schema-tab-selector"
						:schema="schema['properties'][propName]"
						:path="newPath('properties/' + propName)"
						:value="value[propName]"
						:parent="value"
						:property="propName"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						:key="propName"
						v-if="shouldCreateProp(propName)">
					</component>
					<b-btn @click="addProp(propName)" v-else>add {{ propName }}</b-btn>
				</b-list-group-item>
			</b-list-group>
		</section>
	</div>
	<!--<b-card no-body header-class="with-fd-bg" class="my-3">
		<h2 slot="header" @click="visible = !visible" :aria-controls="domId + '-props'" :aria-expanded="visible ? 'true' : 'false'">
			<font-awesome-icon v-if="!visible" :icon="expandArrow" class="text-dark"/> {{ uiTitle }}
		</h2>

		<b-collapse :id="domId + '-props'" v-model="visible">
			<b-card-body>
				<p class="card-text text-muted" v-if="uiDescription"><sup><font-awesome-icon icon="quote-left" class="text-muted" /></sup> {{ uiDescription }}</p>
			</b-card-body>

			<b-list-group flush>
				<b-list-group-item class="border-0" v-for="propName in sortedProps" :key="propName">
					<component is="schema-tab-selector" :schema="schema['properties'][propName]" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab" :depth="depth" :key="propName" v-if="shouldCreateProp(propName)"></component>
					<b-btn @click="addProp(propName)" v-else>add {{ propName }}</b-btn>
				</b-list-group-item>
			</b-list-group>
		</b-collapse>
	</b-card>-->
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
			visible: true,
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
	methods: {
		shouldCreateProp(prop) {
			if (!this.isPostponedProp(prop)) return true
			if (prop in this.value) return true
			console.log("shouldCreateProp():", false)
			return false
		},
		isPostponedProp(prop) {
			return this.postponedProps.includes(prop)
		},
		addProp(prop) {
			this.$store.commit('addProp', {
				val: this.value,
				prop: prop,
			})
		},
	},
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
		sortedProps() {
			if (!this.schema['properties']) {
				console.log("sortedProps(): no props")
				return []
			}

			if (typeof this.ui['order'] === 'object') {
				console.log("sortedProps(): found order:", this.ui['order'])

				return keysWithOrder(this.schema['properties'], this.ui['order'])
			} else {
				console.log("sortedProps(): props not ordered", Object.keys(this.schema['properties']))
				return Object.keys(this.schema['properties'])
			}
		},
		postponedProps() {
			return this.ui['postponed'] || []
		},
		expandArrow() {
			return this.visible ? "ellipsis-v" : "angle-right"
		},
		borderColor() {
			const red = '#e6194B';
			const orange = '#f58231';
			const yellow = '#ffe119';
			const lime = '#bfef45';
			const green = '#3cb44b';
			const cyan = '#42d4f4';
			const blue = '#4363d8';
			const purple = '#911eb4';
			const magenta = '#f032e6';
			const mint = '#aaffc3';
			const teal = '#469990';

			switch(this.depth % 10) {
				case 1: return lime;
				case 2: return green;
				case 3: return cyan;
				case 4: return blue;
				case 5: return purple;
				case 6: return magenta;
				case 7: return mint;
				case 8: return teal;
				case 9: return yellow;
				case 10: return orange;
				default: return red;
			}
		},
		listItemStyle() {
			return { 'border-left': 'solid 10px ' + this.borderColor + ' !important' }
		}
	},
	created() {
		//console.log("v-schema-object:", this, this.$data, this.$props)
		//console.log("registered components:", this.$options.components)
		//console.log("object:", this, "path:", this.path, "children:", this.$children, "slots:", this.$slots)
		if ('visible' in this.ui) this.visible = this.ui['visible']
	},
}
</script>

<style lang="scss" scoped>
.title {
	margin-left: 20px;
}
</style>
