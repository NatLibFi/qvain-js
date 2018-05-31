<template>
	<div>
		<!-- (string widget) -->
		<b-form-group horizontal :label-cols="inArray ? 1 : 4" :description="uiDescription" :label="makeLabel" :feedback="feedback" :state="schemaState">
			<b-input-group>
				<b-form-input :type="inputType" name="" :placeholder="uiPlaceholder" :value="value" :state="schemaState" @input.native="updateValue"></b-form-input>
				<b-input-group-append v-if="inArray">
					<b-btn type="button" variant="danger" @click="deleteMe"><i class="fas fa-minus"></i></b-btn>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

	</div>
</template>

<script src="./v-schema-string.js"></script>
