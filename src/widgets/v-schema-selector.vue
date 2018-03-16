<template>
	<div class="container-fluid">
		<b-button-toolbar v-if="this.$root.DEBUG" aria-label="schema debugging toolbar">
			<b-button-group size="sm" class="mx-1">
				<b-btn @click="showWidgets = !showWidgets"><i class="fa fa-pencil"></i></b-btn>
				<b-btn @click="showTypeSelector = !showTypeSelector"><i class="fa fa-exchange"></i></b-btn>
				<b-btn @click="verbose = !verbose"><i class="fa fa-eye"></i></b-btn>
			</b-button-group>
		</b-button-toolbar>
		<div v-if="showWidgets">
			<p>ui widgets</p>
			<select v-model="customWidget">
				<option v-for="(constructor, name) in this.$options.components">{{ name }}</option>
			</select>
		</div>
		<div v-if="showTypeSelector">
			<p>this schema has multiple possible types; please choose one</p>
			<select v-model="valType">
				<option disabled value="">Please select one</option>
				<option v-for="type in schema.type">
					{{ type }}
				</option>
			</select>
		</div>
		<b-card v-if="verbose" header="" class="mb-2" title="" sub-title="">
			<p>
			path: <code>{{ path || 'root' }}</code><br/>
			type: <code><span v-if="schema.type">{{ schema.type }}</span><span class="meta-info missing" v-else>unknown</span></code></br>
			validationType: <code>{{ valType }}</code><br/>
			is: <code>{{ widget }}</code><br/>
			value: <code>{{ value }}</code><br/>
			valid: <code>isValid</code><br/>
			schema: <code>{{ schema }}</code><br/>
			</p>
			
			<small slot="footer" class="text-muted">
			</small>
		</b-card>
		
		<!-- <h2 v-if="schema.title">{{ schema.title }}</h2><h2 class="metainfo missing" v-else>missing title</h2> -->
		<!-- <h2 :class="{ 'metainfo': !schema.title, 'missing': !schema.title }">{{ schema.title || "missing title" }}</h2> -->
		
		<h2 v-if="schema.title">{{ schema.title }}</h2>
		<p v-if="schema.description">{{ schema.description }}</p>
		
		
		<!-- actual component -->
		<!-- keep-alive -->
		<component :is="widget" :schema="schema" :path="path" :value="value" :valtype="valType" :parent="parent" :property="property" :tab="myTab" v-on="$listeners">
			<p>{{ valType }}</p>
		</component>
		<!-- /keep-alive -->
		
	</div>
</template>

<script src="./v-schema-selector.js"></script>
