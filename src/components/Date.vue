<template>
	<div>
		<legend class="col-form-label pt-0">{{ property.charAt(0).toUpperCase() + property.slice(1) }}</legend>
		<div class="wrapper">
			<p>Select date:</p>
			<datepicker class="widget ml-2"
				placeholder="Click to select"
				v-model="date">
			</datepicker>
		</div>
	</div>
</template>

<script>
import datepicker from 'vuejs-datepicker'
import SchemaBase from '@/widgets/base.vue'

export default {
	name: 'date',
	extends: SchemaBase,
	components: {
		datepicker,
	},
	data() {
		return {
			date: null,
		}
	},
	computed: {
		dateString() {
			if (!this.date) {
				return null
			}

			if (this.schema.format === 'date') {
				return this.date.toISOString().split('T')[0]
			}

			// if format is date-time
			return this.date.toISOString()
		},
	},
	created() {
		this.date = this.value ? new Date(this.value) : null
	},
	watch: {
		date() {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.dateString })
		},
	},
}
</script>


<style lang="scss" scoped>
	.wrapper {
		display: inline-flex;
		> p {
			line-height: 40px;
			vertical-align: middle;
		}
	}
</style>

<style lang="scss">
	.widget.vdp-datepicker div input {
		border-radius: 5px;
		border: 1px solid #ced4da;
		padding: 0.375rem 0.75rem;
	}
</style>
