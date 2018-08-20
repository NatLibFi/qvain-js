<template>
	<div>
		<span v-for="(parent, i) in parents" :key="parent" style="color: #aaaaaa;" :style="{'margin-left': 18*i}">
			<font-awesome-icon :icon="faCaretSquareDown" />
			<a href="#" style="color: #333333; underline: none;" :style="{'font-weight': i + 1 === parents.length ? 'bold' : 'normal'}" @click="$emit('opendir', parent)">{{ parent }}</a><br/>
		</span>

		<span v-if="children.length" :style="{'padding-left': 18*parents.length}">
			<span v-for="child in children" :key="child.id">
				<font-awesome-icon :icon="faCaretSquareRight" />
				<a href="#" @click="$emit('opendir', child.directory_path)">{{ child.directory_name }}</a>
			</span>
		</span>

		<!--		
		<ul v-if="children.length">
			<li v-for="child in children">
				<a href="#" @click="$emit('opendir', child.directory_path)">{{ child.directory_name }}</a>
			</li>
		</ul>
		-->
		<p v-else>no directories</p>
	</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCaretSquareDown,
  faCaretSquareRight,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'filetree',
  props: ['self', 'children'],
  data: function() {
    return {
      open: false,
      icon: { faCaretSquareDown, faCaretSquareRight },
    }
  },
  computed: {
    parents: function() {
      return this.self.split('/').filter(x => x)
    },
  },
  watch: {
    self: function() {
      console.log('self watcher trigger')
    },
  },
  created: function() {
    console.log('filetree component at', this.self)
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
