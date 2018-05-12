import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from './views/Welcome.vue'
import RecordList from './views/RecordList.vue'
import TabUi from './views/TabUi.vue'

import vEditor from './v-editor.vue'
import vLister from './v-lister.vue'
import vSchema from './Attic/v-schema.vue'
import vSchemaForm from './v-schema-form.vue'
import vSchemaViewer from './viewer/v-schema-viewer.vue'
import testAutoComplete from './autocomplete/example.vue'
import vFileBrowser from './filebrowser/filebrowser.vue'
import Token from './auth/token.vue'

Vue.use(VueRouter)


// routes
const routes = [
	{ path: '/', name: "home", component: Welcome, props: false },
	{ path: '/token', component: Token, props: false },
	{ path: '/edit/:id?', component: vEditor, props: true },
	{ path: '/list', component: vLister, props: false },
	{ path: '/records', component: RecordList, props: false, meta: { auth: true } },
	{ path: '/editor/:id', name: 'editor', component: vEditor, props: true },
	{ path: '/schema', component: vSchema, props: false },
	{ path: '/viewschema', component: vSchemaViewer, props: false },
	{ path: '/form', component: vSchemaForm, props: false },
	{ path: '/autocomplete', component: testAutoComplete, props: false },
	{ path: '/tabui', component: TabUi, props: false, meta: { auth: true } },
	{ path: '/files/:project?/:relpath*', name: "files", component: vFileBrowser, props: true },
	//{ path: '/files', component: vFileBrowser, props: true },
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	routes
})
