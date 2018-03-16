<template>
	<div>
		<!-- generic list widget -->
		<b-form-group id="fundertype-form-group" horizontal :label-cols="4" breakpoint="md" :description="ui['description']" :label="ui['label']">
			<b-alert :show="error" variant="danger">error contacting reference data API server: {{ error }}</b-alert>
			<b-input-group>
				<b-form-select v-model="selected"> <!-- class="mb-1" -->
					<option :value="null" disabled>{{ placeholder }}</option>
					<option v-for="(item, index) in items" :key="item.id" :value="item">{{ item.label["en"] }} [{{ item.code }}]</option>
				</b-form-select>
				<b-input-group-append>
					<b-btn variant="secondary" v-b-popover.hover="ui['help']" title="help"><span class="fas fa-question-circle"></span></b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>
	</div>
</template>

<script src="./list.js"></script>
