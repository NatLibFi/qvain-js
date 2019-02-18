<template>
	<div style="max-width: 400px; font-size: small;">
		<ul class="list-group list-group-flush">
			<li class="list-group-item d-flex justify-content-between align-items-center p-1" :class="{ 'text-muted': countChildren(propValue) < 1 }" v-for="(propValue, propName) in rootProps" :key="propName">
				<span :class="{ 'text-muted': countChildren(propValue) < 1 }">{{ propName }}</span>
				<span v-if="typeof propValue === 'object'" class="badge badge-dark px-2">{{ countChildren(propValue) }}</span>
				<span v-else-if="propValue !== undefined && propValue !== ''" class="px-1 text-dark">✓</span>
				<span v-else class="px-2 text-dark">…</span>
			</li>
		</ul>

		<p v-if="!rootProps" class="font-italic">no items</p>
	</div>
</template>

<script>
export default {
	name: 'Overview',
	data: function() {
		return {}
	},
	methods: {
		isNested(val) {
			return typeof val === 'object'
		},
		countChildren(val) {
			return typeof val === 'object' ? Object.keys(val).length : val !== undefined && val !== "" ? 1 : 0
		},
	},
	computed: {
		rootProps() {
			return typeof this.$store.state.record === 'object' ? this.$store.state.record : null
		},
	},
	watch: {
	},
	directives: {
	},
}
</script>
