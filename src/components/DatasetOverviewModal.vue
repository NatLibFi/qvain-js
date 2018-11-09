<template>
	<b-modal size="sm" lazy ok-only title="Dataset overview" v-bind="$attrs" v-on="$listeners">
		<Overview></Overview>
	</b-modal>
</template>

<script>
import Overview from '@/components/Overview.vue'

export default {
	name: 'DatasetOverviewModal',
	components: {
		Overview,
	},
}

</script>
