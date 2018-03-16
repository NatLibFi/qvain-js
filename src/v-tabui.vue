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
		<b-form-textarea name="textarea" rows="8" cols="80" placeholder="test data here" v-model="testdata" :state="testdataValid" @input="testdataValid=null"></b-form-textarea>
		<b-alert class="mt-1 mb-1" variant="danger" :show="dataParseError.length > 0" dismissible @dismissed="dataParseError=''">error: {{ dataParseError }}</b-alert>
		<b-button class="mt-1" type="button" @click="parseJson()">set</b-button> <b-button class="mt-1" type="button" @click="getJson()">get</b-button>
		<b-button class="mt-1" type="button" @click="runValidator()" :disabled="unsubscribeFunc === null">validate</b-button>
		<b-form-checkbox id="checkbox-live" @change="toggleValidator()" v-model="doLive" checked="unsubscribeFunc !== null">live?</b-form-checkbox>
		<br/>

		<b-progress class="mt-1" :max="$store.state.stats.q" show-value>
			<b-progress-bar :value="$store.state.stats.pass" variant="success"></b-progress-bar>
			<b-progress-bar :value="$store.state.stats.q - $store.state.stats.pass - $store.state.stats.fail" variant="warning"></b-progress-bar>
			<b-progress-bar :value="$store.state.stats.fail" variant="danger"></b-progress-bar>
		</b-progress>
    
		<hr/>
		<h2>Fairdata dataset schema</h2>
		
		<b-tabs v-if="selectedSchema">
			<b-tab :title="`Tab ${i}`" v-for="i in [1, 2, 3, 4, 5, 6]" :key="i">
				<component is="schema-tab-selector" :schema="schemaJson" path="" name="/" :parent="$store.state" property="record" :value="$store.state.record" :tab="startTab" :activeTab="i" @typeChanged=""></component>

				<!--
				<p class="text-secondary">Tab Contents {{i}}</p>
				<b-btn size="sm" variant="danger" class="float-right" @click="()=>closeTab(i)">Close tab</b-btn>
				-->
			</b-tab>

			<!-- Render this if no tabs -->
			<div slot="empty" class="text-center text-muted">
				There are no open tabs<br>
				Open a new tab using + button.
			</div>
		</b-tabs>
		
	</div>
</template>

<script src="./v-tabui.js"></script>
