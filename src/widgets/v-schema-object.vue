<template>
	<div>
		<!-- (object component) -->
		<h2 v-bind:class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2>
		
		<p v-if="schema.description">{{ schema.description }}</p>

		<div v-for="(propSchema, propName) in schema['properties']">
			<!-- <b-button v-b-tooltip.hover.auto :title="propName"><i class="fa fa-tag" aria-hidden="true"></i></b-button> -->

			<component is="schema-tab-selector" :schema="propSchema" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab"></component>
		</div>
		
	</div>
</template>

<script src="./v-schema-object.js"></script>
