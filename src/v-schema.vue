<template>
	<div class="container-fluid">
		<b-button-toolbar style="margin-top: 1em;">
			<button type="button" class="btn btn-sm" v-bind:class="{ active: showSchemaOutput, 'btn-secondary': !showSchemaOutput }" @click="showSchemaOutput = showSchemaOutput ? false : true">toggle schema output</button>
			<button type="button" class="btn btn-sm" v-bind:class="{ active: showSchemaSource, 'btn-secondary': !showSchemaSource }" @click="showSchemaSource = showSchemaSource ? false : true">toggle schema source</button>
			<button type="button" class="btn btn-sm" v-bind:class="{ active: showSchemaDefinitions, 'btn-secondary': !showSchemaDefinitions }" @click="showSchemaDefinitions = !showSchemaDefinitions">toggle schema definitions</button>
		</b-button-toolbar>
		
		<b-form-select v-model="selectedSchema" :options="getTestSchemaNames()" class="mb-3"></b-form-select>
		
		<h1 style="margin-top: 1em;">schema parser</h1>

		<b-alert :variant="hasSchemaError ? 'danger' : 'success'" :show="schemaStatus.length">
			{{ schemaStatus }}
		</b-alert>
		
		<ul id="widgets">
			<li v-for="widget in widgets">
				{{ widget.type }}
			</li>
		</ul>
		
		<hr/>
		<code v-show="showStats">
			<template v-for="(val, key) in stats">
			{{ key }}: {{ val }}<br/>
			</template>
		</code>

		<hr/>
		<code style="overflow-x: scroll;" v-show="showSchemaOutput"><pre>{{ schemaOutput }}</pre></code>

		<hr/>
		<code style="overflow-x: scroll;" v-show="showSchemaDefinitions"><pre>{{ schemaDefinitions }}</pre></code>
		
		<hr/>
		<code v-show="showSchemaSource"><pre>{{ schemaSource }}</pre></code>
	</div>
</template>

<script src="./v-schema.js"></script>
