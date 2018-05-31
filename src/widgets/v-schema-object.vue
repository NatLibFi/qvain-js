<template>
	<b-container fluid>
		<!-- (object component) -->
		<!-- h2 v-bind:class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2 -->
		<h2>{{ uiTitle }}</h2>

		<p v-if="uiDescription">{{ uiDescription }}</p>

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
		depth: {{ depth }} {{ typeof depth }}
		<b-row v-for="(propSchema, propName) in schema['properties']" :key="propName">
			<b-col>
			<!-- <b-button v-b-tooltip.hover.auto :title="propName"><i class="fa fa-tag" aria-hidden="true"></i></b-button> -->

			<component is="schema-tab-selector" :schema="propSchema" :path="newPath('properties/' + propName)" :value="value[propName]" :parent="value" :property="propName" :tab="myTab" :activeTab="activeTab" :depth="depth"></component>
			</b-col>
		</b-row>
		
	</b-container>
</template>

<script src="./v-schema-object.js"></script>
