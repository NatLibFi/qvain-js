<template>
	<font-awesome-icon class="info-icon"
		v-if="description"
		:icon="icons.faQuestionCircle"
		v-b-tooltip.hover.left
		:title="description"/>
</template>

<style lang="scss" scoped>
.info-icon {
	font-size: 20px;
}
</style>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faQuestionCircle,
	faSquare
} from '@fortawesome/free-regular-svg-icons';
import {
	faInfo
} from '@fortawesome/free-solid-svg-icons';

export default {
	name: 'info-icon',
	components: {
		FontAwesomeIcon,
	},
	props: {
		description: {
			type: String,
		}
	},
	computed: {
		icons() {
			return {
				faQuestionCircle,
				faSquare,
				faInfo
			};
		},
	}
}
</script>
