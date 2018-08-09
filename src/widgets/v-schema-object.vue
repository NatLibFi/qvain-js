<template>
	<b-card no-body header-class="with-fd-bg" class="my-3">
		<h2 slot="header">{{ uiTitle }}</h2>

		<b-card-body>
		<p class="card-text text-muted" v-if="uiDescription"><sup><i class="fas fa-quote-left text-muted"></i></sup> {{ uiDescription }}</p>
		</b-card-body>

		<code v-if="false">
			q: {{ schema['.q'] }}<br/>
			local: {{ q }}<br/>
			path: {{ path }}<br/>
			value: {{ value }}<br/>
			vState: {{ vState[path] || "unset" }}<br/>
			myState: {{ myState || "unset" }}<br/>
			depth: {{ depth }} {{ typeof depth }}
			<b-btn @click="q = schema['.q']">set q</b-btn>
			<b-btn @click="schema.blah = 'wef'">set schema</b-btn>
			<b-btn @click="schema.type = 'wef'">set schema type</b-btn>
			<b-alert variant="danger" :show="myState.e && myState.e.length > 0">
				<ul>
					<li v-for="e in myState.e">{{ e }}</li>
				</ul>
			</b-alert>
		</code>
	<b-list-group flush>
		<!-- b-row v-for="(propSchema, propName) in schema['properties']" :key="propName" -->
			<!-- b-col -->
			<!-- <b-button v-b-tooltip.hover.auto :title="propName"><i class="fa fa-tag" aria-hidden="true"></i></b-button> -->
			<span v-if="false">
			{{ $children.map(x => x.$children.length) }}
			{{ $children.map(x => '$vnode' in x) }}
			{{ $children.map(x => x.path) }}
			</span>
		<b-list-group-item class="border-0" v-for="(propSchema, propName) in schema['properties']" :key="propName" :test="'test-'+propName">
			<component is="schema-tab-selector" :schema="propSchema" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab" :depth="depth"></component>
			<!-- /b-col -->
		</b-list-group-item>
		<!-- /b-row -->
	</b-list-group>
	</b-card>
</template>

<style>
div:empty {
	background: lime;
	/* display: none; */
}

/*
	logos:
	fd_logo_neg_80.png fd_logo_neg_160.png fd_logo_pos_80.png fd_logo_pos_160.png
	tree_logo_300px.png fd_tree_logo_colour_trans_300.png fd_tree_logo_gray_300.png fd_tree_logo_gray_trans_300.png fd_tree_logo_lightgray_trans_300.png
*/
.with-fd-bg {
	background-image: url('/imgs/fd_tree_logo_lightgray_trans_300.png');
	background-position: -150px -150px; /* left */
	/* background-position: top -150px right -100px; */ /* right */
	background-repeat: no-repeat;
}
</style>

<script>
import vSchemaBase from './v-schema-base.vue'
//import uiComponents from './uicomponents.js'
//import vSchemaSelector from './v-schema-selector.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-object',
	description: "generic object",
	schematype: 'object',
	data: function() {
		return {
			q: "not set",
		}
	},
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
	},
	created() {
		//console.log("v-schema-object:", this, this.$data, this.$props)
		//console.log("registered components:", this.$options.components)
		console.log("object:", this, "path:", this.path, "children:", this.$children, "slots:", this.$slots)
	},
}
</script>
