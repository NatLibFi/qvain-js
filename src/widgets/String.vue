<template>
	<record-field :required="true" :wrapped="false" :header="!inArray">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<!--<ValidationStatus :status="validationStatus" />-->
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<b-form-input
				:type="inputType"
				:placeholder="uiPlaceholder"
				:value="value"
				:state="schemaState"
				@input.native="updateValue">
			</b-form-input>
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
input[type=text].form-control,
input[type=url].form-control {
	border: 0;
	border-radius: 0;
	border-bottom: solid 1px lightgray;

	&:focus {
		border-bottom-color: #2ec7ff;
	}

	&.is-valid:focus {
		box-shadow: none;
	}
}
</style>


<script>
import vSchemaBase from './base.vue'
import { dataPointer } from '../../tmp/datapointer.js'

import ValidationStatus from '@/partials/ValidationStatus.vue';
import RecordField from '@/composites/RecordField.vue';
import TitleComponent from '@/partials/Title.vue';
import InfoIcon from '@/partials/InfoIcon.vue';

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: 'generic string',
	schematype: 'string',
	components: {
		ValidationStatus,
		RecordField,
		TitleComponent,
		InfoIcon
	},
	data() {
		return {
			label: '',
			feedback: '',
			state: null,
			editing: null,
			hover: null,
		}
	},
	methods: {
		deleteMe(event) {
			console.log('schema-string: removal requested', event, this.property)
			this.$parent.$emit('delete', this.property)
		},
		deleteIfEmpty(event) {
			if (this.value === undefined || this.value.length < 1) {
				this.$parent.$emit('delete', this.property)
			} else {
				this.editing = false
			}
		},
		updateValue(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value,
			});
		},
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		inputType: function() {
			if (!('format' in this.schema)) return 'text';
			switch (this.schema['format']) {
				case 'uri':
					return 'url';
				case 'time':
					return 'time';
				case 'date':
					return 'date';
				case 'date-time':
					return 'date';
				default:
					return 'text';
			}
		},
		ctxIcon() {
			return this.hover ? "trash" : "pen"
		},
		datapath() {
			return dataPointer(this.path)
		},
		dataValue() {
			return this.$store.getters.getPath(this.datapath)
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	created() {
	},
}
</script>
