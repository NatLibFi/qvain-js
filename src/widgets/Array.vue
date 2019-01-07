<template>
	<wrapper class="min-height" :wrapped="true">
		<!--<header>
			<h3>
			{{ uiTitle }}
			<font-awesome-icon v-if="value.length < minimum"
				icon="exclamation-triangle"
				class="text-dark"
				v-b-tooltip.hover="`You need at least ${minimum}!`" />
			</h3>
		</header>-->
		<!--<b-alert variant="danger" dismissible :show="!!error" @dismissed="error = null">{{ error }}</b-alert>-->
		<!--<div class="float-right" v-for="e in schemaErrors">
			<b-badge variant="danger" class="q-validation-error">
				<font-awesome-icon icon="exclamation-triangle" fixed-width/>
				{{ e }}
			</b-badge>
		</div>-->

		<!--<b-form-group :label-cols="2" :description="uiDescription" :label="uiTitle" :state="schemaState">-->
			<h3>{{uiTitle}}</h3>
			<p class="small form-text text-muted">{{uiDescription}}</p>
			<div class="d-flex align-items-stretch float-right"><!-- buttons -->
				<b-btn type="button" variant="secondary" class="mr-2"><font-awesome-icon icon="list" fixed-width class="mr-2"/> <span>{{ minimum || "–" }} / {{ value.length }} / {{ maximum || "–" }}</span></b-btn>
				<b-btn type="button" variant="primary" :disabled="value.length >= this.maximum" @click="doPlus()"><font-awesome-icon icon="plus" fixed-width /></b-btn>
			</div>
			<b-tabs :value="tabIndex" class="tab-array-margin" pills>
				<!--
					There is a bug in bootstrap-vue preventing correct update of tab title template (template is not reactive)
					By making the actual tab component depend on the tabTitle function we make it emit tab change every time tabTitle is update.
					The class update_trigger_hack itself does nothing.
					https://github.com/bootstrap-vue/bootstrap-vue/issues/1677
				-->
				<b-tab
					v-for="(child, index) in value"
					style="{margin-top: 5px}"
					:key="index"
					:title-link-class="{ 'update_trigger_hack': !!tabTitle(index) }">
					<template slot="title">
     					{{ tabTitle(index) }} <font-awesome-icon icon="times" @click="deleteElement(index)" />
   					</template>

					<TabSelector
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						@delete="deleteElement"
						:key="'array-' + index" />
				</b-tab>
			</b-tabs>

			<!--
			<b-list-group flush>
				<b-list-group-item class="list-item" v-for="(child, index) in value" :key="index">
					<TabSelector
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						@delete="deleteElement"
						:key="'array-' + index" />
				</b-list-group-item>
				<b-list-group-item v-if="!value || value.length < 1"><empty-note>no items, add one!</empty-note></b-list-group-item>
			</b-list-group>
			-->

			<!--
				<div slot="invalid-feedback">{{ schemaErrors.join(';') }}</div>
		</b-form-group>
		-->
		<!--
		<footer>
			list <button type="button" :disabled="!value || value.length <= this.minimum" @click="doMinus">-</button> | <button type="button" :disabled="value.length >= this.maximum" @click="doPlus">+</button>
			(min: {{ minimum }} / max: {{ maximum || '-' }})
			{{ schemaErrors }}
		</footer>
		-->
	</wrapper>
</template>
<style lang="scss" scoped>
.list-item {
	margin-bottom: 20px;
    border-bottom: 0;
	border-top: 0;
	padding: 0;
}
.min-height {
	min-height: 160px;
}
</style>

<style>
.tab-array-margin.tabs .tab-content {
	margin-top: 15px;
}
</style>


<script>
import vSchemaBase from './base.vue';
import ValidationPopover from '@/components/ValidationPopover.vue';
import Wrapper from '@/components/Wrapper.vue';
import TabSelector from '@/widgets/TabSelector.vue';

export default {
	extends: vSchemaBase,
	name: 'schema-array',
	description: "generic array, nested",
	schematype: 'array',
	components: {
		ValidationPopover,
		Wrapper
	},
	data() {
		return {
			error: null,
			minimum: 0,
			maximum: 0,
			tabIndex: 0,
		}
	},
	methods: {
		tabTitle(index) {
			const objectAtIndexExists = typeof this.parent[this.property][index] !== 'undefined';
			if (!objectAtIndexExists) {
				return `#${index}`;
			}

			const tabObject = this.parent[this.property][index];
			const tabObjectType = tabObject['@type'];

			if (tabObjectType === 'Person' && tabObject.name) {
				return tabObject.name;
			}

			if (tabObjectType === 'Person') {
				return `#${index} (Person)`;
			}

			if (tabObjectType === 'Organization' && (tabObject.name['fi'] || tabObject.name['en'])) {
				return tabObject.name['fi'] || tabObject.name['en'];
			}

			if (tabObjectType === 'Organization') {
				return `#${index} (Organization)`;
			}

			return `#${index}`;
		},
		doMinus() {
			// it's safe to pop() a zero-length array
			if (this.value.length > this.minimum) {
				this.$store.commit('popValue', { p: this.parent, prop: this.property, val: this.value })
				return true
			}
			return false
		},
		doPlus() {
			if (this.maximum === undefined || this.value.length < this.maximum) {
				//this.value.push({})
				this.$store.commit('pushValue', { p: this.parent, prop: this.property, val: undefined })
				console.log("didPlus, length now:", this.value.length)
				console.log('Set active tab to', this.value.length - 1);
				this.$nextTick(function() { // make sure that the tab is there before causing the new tab to be selected
					this.tabIndex = this.value.length - 1;
				})
				return true
			}
			return false
		},
		deleteElement(index) {
			console.log("schema-array: request to delete element with index", index, "value:", this.value[index])
			if (index >= 0 && index < this.value.length) {
				const val = [...this.value.slice(0, index),  ...this.value.slice(index +1, this.value.length)];
				console.log(val);
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val
				});
			} else {
				console.log("deleteElement: attempt to remove non-existing element at index", index)
			}
		},
		schemaForChild: function(index) {
			if (this.isTuple) {
				let additionalSchema = typeof this.schema['additionalItems'] === 'object' ? this.schema['additionalItems'] : {}

				return index < this.schema['items'].length ? this.schema['items'][index] : additionalSchema
			} else {
				return this.schema['items']
			}
		},
		init: function() {
			this.minimum = typeof this.schema['minItems'] === 'number' && this.schema['minItems'] > 0 ? this.schema.minItems : 0
			this.maximum = typeof this.schema['maxItems'] === 'number' && this.schema['maxItems'] > 0 ? this.schema.maxItems : undefined
			//console.log("schema-array: set min/max", this.minimum, this.maximum)
			if (this.isTuple && !this.allowAdditional) this.maximum = this.schema['items'].length
		},
	},
	computed: {
		isTuple: function() {
			// list or tuple validation?
			return this.schema['items'] instanceof Array
		},
		allowAdditional: function() {
			// additionalItems: true if missing, true if true, true when object; false if false
			return this.schema['additionalItems'] !== false
		},
	},
	created() {
		if (this.value == undefined) {
			console.log("array: undefined value for path", this.path)
		}
		console.log("array: typeof", this.path, typeof this.value)
		return this.init()
	},
}
</script>
