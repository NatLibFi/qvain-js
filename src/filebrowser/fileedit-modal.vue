<template>
	<b-modal id="actual-fileedit-modal" ref="actual-fileinfo-modal" @hide="reset" title="set file metadata" ok-only>
		<b-form-group description="description comes here." label="Enter your label" label-for="input1" :state="state">
			<b-form-input id="input1" :state="state" v-model.trim="title"></b-form-input>
			<b-form-input id="input2" :state="state" v-model.trim="description"></b-form-input>
			<b-form-input id="input3" :state="state" v-model.trim="encoding"></b-form-input>
			<b-form-input id="input3" :state="state" v-model.trim="format"></b-form-input>
		</b-form-group>
		{{ title }}
		<pre>{{ apiData }}</pre>
	</b-modal>
</template>

<script>
export default {
	name: 'fileedit-modal',
	props: {},
	data: function() {
		return {
			title: null,
			description: null,
			encoding: null,
			format: null,
			state: null,
			apiData: null,
		}
	},
	methods: {
		show: function(item, index, button) {
			console.log("modal called for item:", item, index, button, typeof item)
			this.apiData = item
			if (typeof item === 'object' && typeof item['file_characteristics'] === 'object') {
				let chars = item['file_characteristics']
				this.title = chars['title'] || null
				this.description = chars['description'] || null
				this.encoding = chars['encoding'] || null
				this.format = item['file_format'] || null
			}
			this.$refs['actual-fileinfo-modal'].show()
		},
		reset: function() {
			this.apiData = null
			this.title = null
			this.encoding = null
			this.description = null
		},
		save: function() {
		},
	},
	computed: {
	},
	created: function() {},
}
</script>
