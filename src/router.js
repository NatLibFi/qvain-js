import Vue from 'vue'
import VueRouter from 'vue-router'

import AgentView from './views/AgentView.vue'
import Welcome from './views/Welcome.vue'
import RecordList from './views/RecordList.vue'
import Datasets from './views/Datasets.vue'
import TabUi from './views/TabUi.vue'
import Editor from './views/Editor.vue'
import UserInfo from './views/UserInfo.vue'
import vSchemaViewer from './viewer/v-schema-viewer.vue'
import SingleTab from './views/SingleTab.vue'
import testAutoComplete from './widgets/refdata/autocomplete.vue'
import vFileBrowser from './filebrowser/filebrowser.vue'
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
	{ path: '/token', component: Token, props: false },
	{ path: '/records', component: RecordList, props: false, meta: { auth: true } },
	{ path: '/datasets', component: Datasets, props: false, meta: { auth: true } },
	{ path: '/viewschema', component: vSchemaViewer, props: false },
	{ path: '/autocomplete', component: testAutoComplete, props: false },
	{ path: '/orcid', component: OrcidSearch, props: false },
	{ path: '/personlist', component: PersonList, props: false },
	{ path: '/editablelist', component: EditableList, props: false },
	{ path: '/tags', component: Tags, props: false },
	{ path: '/config', component: Config, props: false },
	{ path: '/userinfo', component: UserInfo, props: false, meta: { auth: true } },
	//{ path: '/editor', name: "editor", component: Editor, props: true, meta: { auth: true } },
	{ path: '/dataset', name: "editor", component: Editor, props: false, meta: { auth: true }, redirect: '/dataset/description', children: [
		{ path: 'actors1', component: AgentView, props: false },
		{ path: ':tab/:project?/:relpath*', name: 'files', component: SingleTab },
		{ path: ':tab', component: SingleTab },
	]},
	{ path: '/new', component: TabUi, props: false, meta: { auth: true }, redirect: '/new/description', children: [
		{ path: ':tab/:project?/:relpath*', name: 'filesx', component: SingleTab },
		{ path: ':tab', component: SingleTab },
	]},
	/*
		{ path: '/tabui', component: TabUi, props: false, meta: { auth: true } },
		{ path: '/editor', name: "editor", component: Editor, props: true, meta: { auth: true } },
		{ path: '/files/:project?/:relpath*', name: "files", component: vFileBrowser, props: true },
		//{ path: '/files', component: vFileBrowser, props: true },
	*/
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	routes,
})
