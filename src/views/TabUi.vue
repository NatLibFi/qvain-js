<template>
	<div class="container-fluid">
		
		<div v-if="false">
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

			<h2>test data</h2>
			<b-form-textarea name="textarea" rows="8" cols="80" placeholder="test data here" v-model="testdata" :state="testdataValid" @input="testdataValid=null"></b-form-textarea>
			<b-alert class="mt-1 mb-1" variant="danger" :show="dataParseError.length > 0" dismissible @dismissed="dataParseError=''">error: {{ dataParseError }}</b-alert>
			<b-button class="mt-1" type="button" @click="parseJson()">set</b-button>
			<b-button class="mt-1" type="button" @click="getJson()">get</b-button>
			<b-button class="mt-1" type="button" @click="mergeJson()">merge</b-button>
			<b-button class="mt-1" type="button" @click="runValidator()" :disabled="unsubscribeFunc !== null">validate</b-button>
			<b-form-checkbox id="checkbox-live" @change="toggleValidator()" v-model="doLive" checked="unsubscribeFunc !== null">live?</b-form-checkbox>
			<br/>

			<b-progress class="mt-1" :max="$store.state.stats.q" show-value>
				<b-progress-bar :value="$store.state.stats.pass" variant="success"></b-progress-bar>
				<b-progress-bar :value="$store.state.stats.q - $store.state.stats.pass - $store.state.stats.fail" variant="warning"></b-progress-bar>
				<b-progress-bar :value="$store.state.stats.fail" variant="danger"></b-progress-bar>
			</b-progress>

			<b-button-group>
				<b-input-group>
					<b-form-input v-model="whereisInput"></b-form-input>
					<b-btn @click="whereis">whereis</b-btn>
				</b-input-group>
			</b-button-group>{{ whereisReply }}

			<hr/>
		</div>

		<div>
			<b-button-toolbar aria-label="Dataset toolbar" class="my-2">
				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Create new dataset">New</b-btn>
					<b-btn v-b-tooltip.hover title="Clone this dataset as new">Clone</b-btn>
				</b-button-group>
				<b-input-group size="sm" class="w-25 mx-1" prepend="schema">
					<b-form-select value="fairdata-ui" :options="getTestSchemaNames()" v-model="selectedSchema"></b-form-select>
				</b-input-group>
				<b-input-group size="sm" class="w-25 mx-1" prepend="owner">
					<b-form-select :value="$auth.user ? $auth.user.name : 'you'" :options="[ $auth.user ? $auth.user.name : 'you' ]"></b-form-select>
				</b-input-group>
					<b-button-group size="sm" class="mx-1">
				<b-btn v-b-tooltip.hover title="Save this dataset">Save</b-btn>
				<b-btn v-b-tooltip.hover title="Ready to publish">Publish</b-btn>
				<b-btn v-b-tooltip.hover title="Back to start page" to="/">Cancel</b-btn>
				</b-button-group>

				<b-button-group size="sm" class="mx-1">
					<b-btn v-b-tooltip.hover title="Validate dataset" size="sm" @click="runValidator()" :disabled="unsubscribeFunc !== null">validate</b-btn>
					<b-btn v-b-tooltip.hover title="Validate while editing" size="sm" id="checkbox-live" :pressed="unsubscribeFunc !== null" @change="toggleValidator()" v-model="doLive">live?</b-btn>
				</b-button-group>
			</b-button-toolbar>
		</div>

		<h2>Fairdata dataset schema</h2>
		<b-tabs v-if="selectedSchema" v-model="tabIndex">
			<b-tab :title="name ? name : `Tab ${i}`" v-for="(name, i) in tabs" :key="i">
			<!-- b-tab :title="`Tab ${i}`" v-for="i in [0, 1, 2, 3]" :key="i" -->
			<!-- b-tab :title="`Tab ${i}`" v-for="i in [0]" :key="i" -->
				<component is="schema-tab-selector" v-if="tabIndex == i" :schema="schemaJson" path="" :parent="$store.state" property="record" :value="$store.state.record" :tab="startTab" :activeTab="i+1" :depth="0"></component>

				<!--
				<p class="text-secondary">Tab Contents {{i}}</p>
				<b-btn size="sm" variant="danger" class="float-right" @click="()=>closeTab(i)">Close tab</b-btn>
				-->
			</b-tab>

			<!-- Render this if no tabs -->
			<div slot="empty" class="text-center text-muted">
				There are no tabs
			</div>
		</b-tabs>
		
	</div>
</template>

<script src="./TabUi.js"></script>
