<template>
	<div>
		<!-- (anyof component) -->
		<h2 v-bind:class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2>
		
		<p v-if="schema.description">{{ schema.description }}</p>
		anyOf: {{ schemaState }}

		<div v-for="(sub, i) in schema['anyOf']" :key="sub">
			{{ sub['type'] }} {{ i }}

			<TabSelector :schema="sub" :path="newPath('anyOf/' + i)" :value="value" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab"></TabSelector>
		</div>
		
	</div>
</template>

<script>
import vSchemaBase from './base.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-anyof',
	description: "generic anyof",
	schematype: '',
}
</script>
