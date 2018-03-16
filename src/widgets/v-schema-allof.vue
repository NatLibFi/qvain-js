<template>
	<div>
		<!-- (allof component) -->
		<h2 v-bind:class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2>
		
		<p v-if="schema.description">{{ schema.description }}</p>
		allOf: {{ liveState }}

		<div v-for="(sub, i) in schema['allOf']">
			{{ sub['type'] }} {{ i }}

			<component is="schema-tab-selector" :schema="sub" :path="newPath('allOf/' + i)" :value="value" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab"></component>
		</div>

		<component is="schema-tab-selector" :schema="merged" :path="newPath('allOf')" :value="value" :parent="parent" :property="property" :tab="myTab" :activeTab="activeTab"></component>
		
	</div>
</template>

<script src="./v-schema-allof.js"></script>
