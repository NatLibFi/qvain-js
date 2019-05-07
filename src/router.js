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
	{ path: '/', name: "home", component: Welcome, props: true },
	{ path: '/token', component: Token, props: false },
	{ path: '/records', component: RecordList, props: false, meta: { auth: true } },
	{ path: '/datasets', component: Datasets, props: false, meta: { auth: true } },
	{ path: '/viewschema', component: SchemaViewer, props: false },
	{ path: '/autocomplete', component: testAutoComplete, props: false },
	{ path: '/orcid', component: OrcidSearch, props: false },
	{ path: '/personlist', component: PersonList, props: false },
	{ path: '/editablelist', component: EditableList, props: false },
	{ path: '/tags', component: Tags, props: false },
	{ path: '/config', component: Config, props: false },
	{ path: '/userinfo', component: UserInfo, props: false, meta: { auth: true } },
	{ path: '/dataset/:id', name: "editor", component: Editor, props: true, meta: { auth: true }, children: [
		{ path: '', redirect: { name: 'tab' } },
		{ path: ':tab', name: "tab", component: SingleTab },
		{ path: ':tab/:project?/:relpath*', name: 'files', component: SingleTab }, // what is this for?
	]},
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	base: process.env.VUE_APP_PUBLIC_PATH,
	routes,
})
