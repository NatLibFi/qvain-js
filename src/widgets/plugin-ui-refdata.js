import refdataList from './refdata/list.vue'

// vue plugin
const refdataWidgets = {
	install(Vue, options) {
		Vue.component(refdataList.name, refdataList)
	}
}

export default refdataWidgets
