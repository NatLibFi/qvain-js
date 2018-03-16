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
		
		<h1 style="margin-top: 1em;">schema viewer</h1>
		
		<!-- Modal Component -->
		<!-- <b-modal id="modal1" ref="modal1" title="Edit schema UI" @ok="handleOk" @shown="clearName"> -->
		<b-modal id="modal1" ref="modal1" title="Edit schema UI">
			editing: {{ curPointer }}
			<form @submit.stop.prevent="handleSubmit">
				<b-form-input type="text" placeholder="Schema UI widget" v-model="uihint"></b-form-input>
			</form>
		</b-modal>
		
		<hint-editor ref="refHintEditor" :schema="{}" path=""></hint-editor>
		<b-btn @click="edit('blah')">open</b-btn>

		<hr/>
		<h2>schema root</h2>
		<ul class="treeview">
			<schema-tree :schema="schema" path="" name="" tab="" :pref="this" :edit="edit" tab="0"></schema-tree>
		</ul>
		
	</div>
</template>

<script src="./v-schema-viewer.js"></script>
