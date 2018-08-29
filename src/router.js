import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from './views/Welcome.vue'
import RecordList from './views/RecordList.vue'
import Datasets from './views/Datasets.vue'
import TabUi from './views/TabUi.vue'

import UserInfo from './views/UserInfo.vue'
import vEditor from './v-editor.vue'
import vLister from './v-lister.vue'
import vSchema from './Attic/v-schema.vue'
import vSchemaForm from './v-schema-form.vue'
import vSchemaViewer from './viewer/v-schema-viewer.vue'
import testAutoComplete from './widgets/refdata/autocomplete.vue'
import vFileBrowser from './filebrowser/filebrowser.vue'
import Token from './auth/token.vue'
import OrcidSearch from './orcid/search.vue'
import PersonList from './person/list.vue'

Vue.use(VueRouter)


// routes
const routes = [
	{ path: '/', name: "home", component: Welcome, props: false },
	{ path: '/token', component: Token, props: false },
	{ path: '/edit/:id?', component: vEditor, props: true },
	{ path: '/list', component: vLister, props: false },
	{ path: '/records', component: RecordList, props: false, meta: { auth: true } },
	{ path: '/editor/:id', name: 'editor', component: vEditor, props: true },
	{ path: '/datasets', component: Datasets, props: false, meta: { auth: true } },
	{ path: '/schema', component: vSchema, props: false },
	{ path: '/viewschema', component: vSchemaViewer, props: false },
	{ path: '/form', component: vSchemaForm, props: false },
	{ path: '/autocomplete', component: testAutoComplete, props: false },
	{ path: '/orcid', component: OrcidSearch, props: false },
	{ path: '/personlist', component: PersonList, props: false },
	{ path: '/tabui', component: TabUi, props: false, meta: { auth: true } },
	{ path: '/userinfo', component: UserInfo, props: false, meta: { auth: true } },
	{ path: '/files/:project?/:relpath*', name: "files", component: vFileBrowser, props: true },
	//{ path: '/files', component: vFileBrowser, props: true },
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	routes
})
