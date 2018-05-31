<template>
	<div>
		<!-- (number widget) -->
		<b-form-group horizontal :label-cols="inArray ? 1 : 4" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState">
			<b-input-group>
				<b-form-input id="jack" type="number" name="" :placeholder="uiPlaceholder" :step="schema['multipleOf']" :value="parent[property]" :state="schemaState" @input.native="updateValue"
				@focus.native="schemaState || $root.$emit('bv::show::popover', 'jack')" @blur.native="$root.$emit('bv::hide::popover', 'jack')"></b-form-input>
				<b-input-group-append v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe"><i class="fas fa-minus"></i></b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>
		errors: {{ schemaErrors }} state: {{ schemaState }}/{{ !!schemaState }} {{ schemaErrors.length < 1 }} validity: {{ validity }} show? {{ showErrors }}
		<b-btn @click="$root.$emit('bv::hide::popover', 'jack')">hide</b-btn>
		<b-popover target="jack" triggers="" :show="!schemaState" title="errors" style="background-color: #660000; color: #aa0000;">{{ schemaErrors }}</b-popover>
		<!-- :show="!schemaState" -->
	</div>
</template>

<script src="./v-schema-number.js"></script>
