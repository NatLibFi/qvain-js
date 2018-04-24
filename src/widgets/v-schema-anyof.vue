<template>
	<div>
		<!-- (anyof component) -->
		<h2 v-bind:class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2>
		
		<p v-if="schema.description">{{ schema.description }}</p>
		anyOf: {{ liveState }}

		<div v-for="(sub, i) in schema['anyOf']" :key="sub">
			{{ sub['type'] }} {{ i }}

			<component :is="schema-tab-selector" :schema="sub" :path="newPath('anyOf/' + i)" :value="value" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab"></component>
		</div>
		
	</div>
</template>

<script src="./v-schema-anyof.js"></script>
