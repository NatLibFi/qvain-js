<template>
	<div>
		<!-- (string widget) -->
		<div v-show="false">
			<code>title: {{ schema['title'] }}</code>
			<code>description: {{ schema['description'] }}</code>
			<code>schema type: {{ schema['type'] }}</code>
			<code>validation type: {{ valtype }}</code>
			<code>prop name: {{ property }}</code>
			(slot)<slot></slot>(/slot)
			<hr/>
		</div>

		<!-- <b-badge :variant="schema['.q'].v ? 'success' : 'danger'" v-b-popover.hover="schema['.q'].errors" title="errors">validity</b-badge> -->
		<!-- q: {{ schema['.q'] }} v: {{ schema['.q'] && schema['.q']['v'] }} state: {{ String(liveState) }} -->
		<b-form-group id="" horizontal :label-cols="4" :description="ui['description'] || schema['description']" :label="makeLabel" :horizontal="true" :feedback="feedback" :state="liveState">
			<b-input-group>
				<b-form-input id="" :type="inputType" name="" placeholder="" :value="value" :state="liveState" @input.native="updateValue"></b-form-input>
				<b-input-group-button v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe">x</b-btn>
				</b-input-group-button>
			</b-input-group>
		</b-form-group>

	</div>
</template>

<script src="./v-schema-string.js"></script>
