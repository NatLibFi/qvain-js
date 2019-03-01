import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from './views/Welcome.vue'
import RecordList from './views/RecordList.vue'
import Datasets from './views/Datasets.vue'
import Editor from './views/Editor.vue'
import UserInfo from './views/UserInfo.vue'
import SchemaViewer from './viewer/v-schema-viewer.vue'
import SingleTab from './views/SingleTab.vue'
import testAutoComplete from './widgets/refdata/autocomplete.vue'
import Token from './auth/token.vue'
import OrcidSearch from './orcid/search.vue'
import PersonList from './person/list.vue'
import EditableList from './widgets/editable-list.vue'
import Tags from './exp/tags.vue'
import Config from './views/Config.vue'

Vue.use(VueRouter)

// routes
const routes = [
	{ path: '/', name: "home", component: Welcome, props: false },
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	routes,
})
