<template>
	<div>
		<legend class="col-form-label pt-0">{{ title }}</legend>
		<div class="wrapper">
			<p>Select time range:</p>
			<datepicker placeholder="From" class="widget ml-2" :disabledDates="disableBefore" v-model="start"></datepicker>
			<p class="ml-2">-</p>
			<datepicker placeholder="To" class="widget ml-2" :disabledDates="disableAfter" v-model="end"></datepicker>
			<div class="align">
				<DeleteButton v-if="inArray" @click="$emit('delete', property)"/>
			</div>
		</div>
		<div>
			<p v-if="start && end" class="ml-2">Time between the two dates: {{timeBetweenString}}</p>
		</div>
	</div>

</template>

<script>
import datepicker from 'vuejs-datepicker'
import SchemaBase from '@/widgets/base.vue'
import { distanceInWords } from 'date-fns'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	name: 'date-range',
	extends: SchemaBase,
	components: {
		datepicker,
		DeleteButton,
	},
	data() {
		return {
			start: null,
			end: null,
		}
	},
	computed: {
		timeBetweenString() {
			return distanceInWords(this.end, this.start)
		},
		disableBefore() {
			return {
				from: this.end,
			}
		},
		disableAfter() {
			return {
				to: this.start,
			}
		},
		title() {
			return this.schema.title
		},
		startDateISO() {
			return this.start ? this.start.toISOString() : null
		},
		endDateISO() {
			return this.end ? this.end.toISOString() : null
		},
	},
	methods: {
		updateValue() {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: {
				start_date: this.startDateISO, end_date: this.endDateISO,
			}})
		},
	},
	created() {
		this.start = this.value.start_date ? new Date(this.value.start_date) : null
		this.end = this.value.end_date ? new Date(this.value.end_date) : null
	},
	watch: {
		start() {
			this.updateValue()
		},
		end() {
			this.updateValue()
		},
	},
}
</script>


<style lang="scss" scoped>
	.wrapper {
		display: inline-flex;
		height: 40px;
		> p {
			line-height: 40px;
			vertical-align: middle;
		}
	}
	.align {
		padding: 12px;
		padding-left: 5px;
	}
</style>

<style lang="scss">
	.widget.vdp-datepicker div input {
		border-radius: 5px;
		border: 1px solid #ced4da;
		padding: 0.375rem 0.75rem;
	}
</style>
