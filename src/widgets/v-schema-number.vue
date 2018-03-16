<template>
	<div>
		<!-- (number widget) -->
		<div v-show="false">
			<code>title: {{ schema['title'] }}</code>
			<code>description: {{ schema['description'] }}</code>
			<code>schema type: {{ schema['type'] }}</code>
			<code>validation type: {{ valtype }}</code>
			<code>parent: {{ parent }}</code>
			<code>prop name: {{ property }}</code>
			<hr/>
			(slot)<slot></slot>(/slot)
		</div>
		<div style="display: none">
		<label>{{ schema['title'] || String(property) || "number" }}:
		<input type="number" name="abc" placeholder="" :step="schema['multipleOf']" :value="parent[property]" @input="updateValue"></input>
		<!-- <span v-if="inArray">{{ '#' + (property + 1) }}</span><span v-else>{{ property }}</span> -->
		<button v-if="typeof property === 'number'" type="button" @click="deleteMe">x</button></label>
		<p v-if="schema['description']">{{ schema['description'] }}</p>
		</div>
		
		<!-- state: {{ liveState }} -->
		<b-form-group id="" horizontal :label-cols="4" :description="ui['description'] || schema['description']" :label="makeLabel" :feedback="feedback" :state="liveState">
			<b-input-group>
				<b-form-input id="" type="number" name="" placeholder="" :step="schema['multipleOf']" :value="parent[property]" :state="liveState" @input.native="updateValue"></b-form-input>
				<b-input-group-button v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe">x</b-btn>
				</b-input-group-button>
			</b-input-group>
		</b-form-group>
	</div>
</template>

<script src="./v-schema-number.js"></script>
