<template>
	<div class="container-fluid">
		<b-form-select v-model="selectedSchema" :options="getTestSchemaNames()" class="mb-3"></b-form-select>
		
		<b-alert variant="info" show>
			selected schema:
			<div v-if=selectedSchema>
				<code>{{ selectedSchema }}</code>
			</div>
			<div v-else>
				<i>none</i>
			</div>
		</b-alert>
		
		<h1 style="margin-top: 1em;">form generator</h1>
		
		<h2>test data</h2>
		<textarea name="textarea" rows="8" cols="80" placeholder="test data here" v-model="testdata"></textarea><br/>
		<button type="button" @click="parseJson()">set</button><br/>
		<b-alert variant="danger" :show="dataParseError.length">error: {{ dataParseError }}</b-alert><br/>

		<!-- <h2>schema root</h2> -->
		<!-- type: {{ schemaJson.type }} -->
		<!-- schema :schema="schemaJson" path="" name="/" :value="value" v-on:validateParent="cuckoo" --><!-- /schema -->

		<hr/>
		<h2>schema root</h2>
		<component :is="schema-selector" :schema="schemaJson" path="" name="/" :value="this.$store.state.record" parent=""></component>
		
	</div>
</template>

<script src="./v-schema-form.js"></script>
