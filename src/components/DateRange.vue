<template>
	<div>
		<legend class="col-form-label pt-0">{{ property.charAt(0).toUpperCase() + property.slice(1) }}</legend>
		<div class="wrapper">
			<p>Select time range:</p>
			<datepicker placeholder="From" class="widget ml-2" :disabledDates="disableBefore" v-model="start"></datepicker>
			<datepicker placeholder="To" class="widget ml-2" :disabledDates="disableAfter" v-model="end"></datepicker>
			<p v-if="start && end" class="ml-2">Time between the two dates: {{timeBetweenString}}</p>
		</div>
	</div>

</template>

<script>
import datepicker from 'vuejs-datepicker';
import vSchemaBase from '../widgets/v-schema-base.vue';
import { distanceInWords } from 'date-fns';

export default {
	name: 'date-range',
	extends: vSchemaBase,
	components: {
		datepicker
	},
	data() {
		return {
			start: null,
			end: null,
		};
	},
	computed: {
		timeBetweenString() {
			return distanceInWords(this.end, this.start);
		},
		disableBefore() {
			return {
				from: this.end,
			};
		},
		disableAfter() {
			return {
    			to: this.start,
			};
		},
	},
}
</script>


<style lang="scss" scoped>
	.wrapper {
		display: inline-flex;
	}
</style>

<style lang="scss">
	.widget.vdp-datepicker div input {
		border-radius: 5px;
		border: 1px solid #ced4da;
	}
</style>
