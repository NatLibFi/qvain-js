<template>
	<ValidationUnclearIcon v-if="status === 'uncertain'" />
	<ValidationSuccessIcon v-else-if="status === 'valid'" />
	<ValidationFailedIcon v-else-if="status === 'invalid'" />
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
		}
	},
	components: {
		ValidationFailedIcon,
		ValidationUnclearIcon,
		ValidationSuccessIcon
	}
}
</script>
