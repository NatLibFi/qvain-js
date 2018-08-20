<template>
	<li>
		<div class="treeview-branch" :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
			<font-awesome-icon :icon="open ? icon.faFolderOpen : icon.faFolder" /> {{ name || "/" }}

			<b-btn variant="link" size="sm" v-b-tooltip.hover.auto title="edit" @click.stop="edit(path, schema)">
				<font-awesome-icon :icon="icon.faEdit" />
			</b-btn>
			<span :class="{ 'text-secondary': !uiTab }">{{ myTab }}</span>

			<!-- <span v-if="isFolder">[{{open ? '-' : '+'}}]</span> -->
		</div>
		<ul class="treeview fa-ul" v-show="open" v-if="isFolder">
			<div class="item" v-for="(sub, key) in schema" :key="sub.id">
				<schema-tree v-if="typeof sub === 'object'" class="item" :schema="sub" :path="path + '/' + key" :name="key" :pref="pref" :edit="edit" :tab="myTab" v-on="$listeners"></schema-tree>
				<li v-else>
					<font-awesome-icon :icon="icon.faSquare" /> {{ key }}</li>
			</div>
			<!-- <schema-tree class="item" v-for="(sub, key) in schema" :schema="sub" :path="path + '/' + key" :name="key" :key="sub.id"></schema-tree> -->
		</ul>
	</li>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFolderOpen,
  faFolder,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

export default {
  name: 'schema-tree',
  props: ['schema', 'path', 'name', 'pref', 'edit', 'tab'],
  data: function() {
    return {
      open: false,
      icon: {
        faSquare,
        faFolder,
        faEdit,
        faFolderOpen,
      },
    }
  },
  computed: {
    isFolder: function() {
      return typeof this.schema === 'object'
    },
    uiTab: function() {
      return (
        this.$store.state.hints[this.path] &&
        this.$store.state.hints[this.path]['tab']
      )
    },
    myTab: function() {
      return typeof this.uiTab === 'number' ? this.uiTab : this.tab
    },
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function() {
      if (!this.isFolder) {
        this.$set(this.schema, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function() {
      this.schema.children.push({ name: 'new stuff' })
    },
    setTab: function() {
      //this.$store.hints
    },
    getHints: function() {
      return this.$store.state.hints[this.path]
    },
    showRoot: function() {
      console.log('root component:', this.$root)
    },
    editSchema: function(path, btn) {
      //this.$emit('edit')
      //this.$parent.$emit('edit')
      this.pref.$emit('edit', path, btn)
      console.log('EMIT edit to', this.pref)
    },
  },
  components: {
    'schema-tree': require('./v-schema-tree.vue').default,
    FontAwesomeIcon,
  },
  created: function() {
    /*
		console.log("typeof schema:", typeof schema)
		console.log("route:", this.$route)
		console.log("parent:", this.$parent)
		console.log("root:", this.$root)
		console.log("editor ref:", this.editor)
		*/
  },
}
</script>
