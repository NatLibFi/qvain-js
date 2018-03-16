<template>
	<div class="autocomplete-input">
		<p class="control has-icon has-icon-right">
			<input v-model="keyword" class="input is-large" placeholder="Search..." @input="onInput($event.target.value)" @keyup.esc="isOpen = false" @blur="isOpen = false" @keydown.down="moveDown" @keydown.up="moveUp" @keydown.enter="select">
			<i :class="['fa', isOpen ? 'fa-angle-up' : 'fa-angle-down']" @click="onArrowClick"></i>
		</p>
		<ul v-show="isOpen" class="options-list">
			<li v-for="(option, index) in fOptions" :class="{'highlighted': index === highlightedPosition}" @mouseenter="highlightedPosition = index" @mousedown="select">
				<slot name="item" :title="option.title" :description="option.description" :thumbnail="option.thumbnail"></slot>
			</li>
		</ul>
	</div>
</template>

<script>
// https://vuejsfeed.com/blog/build-a-reusable-autocomplete-component-with-vue-2-1

export default {
	props: {
		options: {
			type: Array,
			required: true
		},
		listOnly: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			isOpen: false,
			highlightedPosition: 0,
			keyword: ''
		}
	},
	computed: {
		fOptions() {
			const re = new RegExp(this.keyword, 'i')
			return this.options.filter(o => o.title.match(re))
		}
	},
	methods: {
		onInput(value) {
			this.highlightedPosition = 0
			this.isOpen = !!value
		},
		moveDown() {
			if (!this.isOpen) {
				return
			}
			this.highlightedPosition = (this.highlightedPosition + 1) % this.fOptions.length
		},
		moveUp() {
			if (!this.isOpen) {
				return
			}
			this.highlightedPosition = this.highlightedPosition - 1 < 0 ? this.fOptions.length - 1 : this.highlightedPosition - 1
		},
		onArrowClick() {
			this.isOpen = !this.isOpen
		},
		select() {
			console.log("selected:", this.highlightedPosition)
			const selectedOption = this.fOptions[this.highlightedPosition]
			if (!selectedOption && !this.listOnly) {
				this.$emit('select', this.keyword)
				this.isOpen = false
				return
			}
			this.$emit('select', selectedOption)
			this.isOpen = false
			this.keyword = selectedOption.title
		}
	}
}
</script>
