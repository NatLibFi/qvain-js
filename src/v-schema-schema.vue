<template>
	<div><!-- v-schema-schema -->
		<h2 v-if="schema.title">{{ schema.title }}</h2><h2 class="metainfo missing" v-else>missing title</h2>
		<p v-if="schema.description">{{ schema.description }}</p>
		<p>
			path: <code>{{ path || 'root' }}</code><br/>
			type: <code><span v-if="schema.type">{{ schema.type }}</span><span class="meta-info missing" v-else>unknown</span></code></br>
			ui: <code>{{ uiType }}</code><br/>
			value: <code>{{ value }}</code><br/>
			valid: <code>{{ isValid }}</code><br/>
			schema: <code>{{ schema }}</code><br/>
		</p>
		
		<div v-if="showTypeSelector">
			<p>this schema has multiple possible types; please choose one</p>
			<select v-model="uiType">
				<option disabled value="">Please select one</option>
				<option v-for="type in schema.type">
					{{ type }}
				</option>
			</select>
		</div>

		<ul id="">
			<li v-for="child in children">
				child, type: {{ child.component }}
				<component :is="child.component" :schema="child.schema" :path="child.path" :name="child.path" :ref="child.path" :value="child.value" v-on:validate="updateValidity"/>
			</li>
		</ul>
		
		<input type="text" name="" v-model="value" v-if="showInput"/>
	</div>
</template>

<script src="./v-schema-schema.js"></script>
