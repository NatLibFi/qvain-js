<template>
	<record-field :required="true" :wrapped="false" :header="!inArray">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<!--<ValidationStatus :status="validationStatus" />-->
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input" class="input">
			<p v-if="inArray" class="input__number">#{{property}}</p>
			<b-form-input
				:type="inputType"
				:placeholder="uiPlaceholder"
				:value="value"
				:state="schemaState"
				@input.native="updateValue">
			</b-form-input>
			<span class="input__delete">
				<DeleteButton v-if="inArray" @click="deleteMe" />
			</span>
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
.input {
	width: 100%;
	display: inline-flex;

	.input__number {
		padding: 10px;
		margin: 0;
	}

	.input__delete {
		padding: 10px !important;
	}

	> * {
		height: 40px;
	}
}

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

	&.is-invalid:focus {
		box-shadow: none;
	}
}
</style>


<script>
import vSchemaBase from './base.vue'
import { dataPointer } from '../../tmp/datapointer.js'

import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import InfoIcon from '@/partials/InfoIcon.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: 'generic string',
	schematype: 'string',
	components: {
		RecordField,
		TitleComponent,
		InfoIcon,
		DeleteButton,
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
		deleteIfEmpty() {
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
			})
		},
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		inputType: function() {
			if (!('format' in this.schema)) return 'text'
			switch (this.schema['format']) {
			case 'uri':
				return 'url'
			case 'time':
				return 'time'
			case 'date':
				return 'date'
			case 'date-time':
				return 'date'
			default:
				return 'text'
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
			},
		},
	},
	created() {
	},
}
</script>
