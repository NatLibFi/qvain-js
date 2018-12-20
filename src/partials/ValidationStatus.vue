<template>
	<ValidationUnclearIcon v-if="status === 'uncertain'"
		v-b-tooltip.hover.left
		:title="reason || uncertainDefault" />
	<ValidationSuccessIcon v-else-if="status === 'valid'"
		v-b-tooltip.hover.left
		:title="reason || validDefault" />
	<ValidationFailedIcon v-else-if="status === 'invalid'"
		v-b-tooltip.hover.left
		:title="reason || invalidDefault" />
</template>

<style lang="scss" scoped>
</style>

<script>
import ValidationFailedIcon from '@/partials/ValidationFailedIcon.vue';
import ValidationUnclearIcon from '@/partials/ValidationUnclearIcon.vue';
import ValidationSuccessIcon from '@/partials/ValidationSuccessIcon.vue';

export default {
	name: 'validation-status',
	props: {
		status: {
			type: String,
			validator: (val) => ['valid', 'uncertain', 'invalid', null].includes(val)
		},
		reason: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			validDefault: 'This field is valid',
			invalidDefault: 'This field is invalid',
			uncertainDefault: 'This field might be valid. Some values might be empty.'
		};
	},
	components: {
		ValidationFailedIcon,
		ValidationUnclearIcon,
		ValidationSuccessIcon
	}
}
</script>
