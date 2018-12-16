<template>
	<b-form-select :value="value" :options="languages" v-bind="$attrs" v-on="$listeners">
		<template slot="first">
			<option :value="null" disabled class="text-muted">{{ placeholder }}</option>
		</template>
	</b-form-select>
</template>

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
