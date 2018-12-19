<template>
	<b-input-group>
		<b-input-group-text class="height" slot="prepend">
			<font-awesome-icon icon="plus" fixed-width class="text-dark" />
		</b-input-group-text>
		<b-form-select class="select" :options="languages" v-bind="$attrs" v-on="$listeners">
			<template slot="first">
				<option :value="undefined" disabled class="text-muted">{{ placeholder }}</option>
			</template>
		</b-form-select>
	</b-input-group>
</template>

<style lang="scss" scoped>
.height {
	height: 38px;
}
.select:focus {
	border-color: #ced4da !important;
	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
</style>


<script>

import langCodes2 from '@/data/iso639-1.json'

export default {
	name: 'language-select',
	props: {
		value: String,
		placeholder: {
			type: String,
			default: "Select language",
		}
	},
	data() {
		return {
			languages: langCodes2,
		}
	},
}
</script>
