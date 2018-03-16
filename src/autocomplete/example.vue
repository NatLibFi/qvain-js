<template>
	<div class="container-fluid">
		<div id="autocomplete-wrapper">
			<autocomplete-input :options="options" :listOnly="false" @select="onOptionSelect">
				<template slot="item" slot-scope="option">
					<article class="media">
						<figure class="media-left">
							<p class="image is-64x64" style="width: 64px; height: 64px">
								<img :src="option.thumbnail" style="max-width: 100%">
							</p>
						</figure>
						<p>
							<strong>{{ option.title }}</strong>
							<br> {{ option.description }}
						</p>
					</article>
				</template>
			</autocomplete-input>
			<div style="display: block; clear: both;">
				<p>{{ result }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import vAutoComplete from './v-autocomplete.vue'

export default {
	name: "autocomplete-example",
	data: function() {
		return {
			result: "",
			options: [{
				title: 'First Scene',
				description: 'lorem ipsum dolor amet.',
				thumbnail: 'http://lorempicsum.com/nemo/200/200/1'
			}, {
				title: 'Second Scene',
				description: 'lorem ipsum dolor amet.',
				thumbnail: 'http://lorempicsum.com/nemo/200/200/2'
			}, {
				title: 'Third Scene',
				description: 'lorem ipsum dolor amet.',
				thumbnail: 'http://lorempicsum.com/nemo/200/200/3'
			}, {
				title: 'Fourth Scene',
				description: 'lorem ipsum dolor amet.',
				thumbnail: 'http://lorempicsum.com/nemo/200/200/4'
			}]
		}
    },
	methods: {
		onOptionSelect(option) {
			console.log('Selected option:', option)
			if (typeof option === 'object') {
				this.result = "selected predefined option: " + option.title
			} else {
				this.result = "entered unknown option: " + option
			}
		}
	},
	components: {
		'autocomplete-input': vAutoComplete,
	}
}
</script>
