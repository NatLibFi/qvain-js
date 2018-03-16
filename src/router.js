import Vue from 'vue'
import VueRouter from 'vue-router'

import vWelcome from './v-welcome.vue'
import vEditor from './v-editor.vue'
import vLister from './v-lister.vue'
import vRecordLister from './v-record-lister.vue'
import vSchema from './v-schema.vue'
import vSchemaForm from './v-schema-form.vue'
import vSchemaViewer from './viewer/v-schema-viewer.vue'
import testAutoComplete from './autocomplete/example.vue'
import vTabUi from './v-tabui.vue'
import vFileBrowser from './filebrowser/filebrowser.vue'

Vue.use(VueRouter)

// route components
//const vEditor = { template: '<div>editor</div>' }
//const vLister = { template: '<div>lister</div>' }

// routes
const routes = [
	{ path: '/', component: vWelcome, props: false },
	{ path: '/edit/:id?', component: vEditor, props: true },
	{ path: '/list', component: vLister, props: false },
	{ path: '/records', component: vRecordLister, props: false },
	{ path: '/editor/:id', name: 'editor', component: vEditor, props: true },
	{ path: '/schema', component: vSchema, props: false },
	{ path: '/viewschema', component: vSchemaViewer, props: false },
	{ path: '/form', component: vSchemaForm, props: false },
	{ path: '/autocomplete', component: testAutoComplete, props: false },
    { path: '/tabui', component: vTabUi, props: false },
	{ path: '/files/:project?/:relpath*', name: "files", component: vFileBrowser, props: true },
	//{ path: '/files', component: vFileBrowser, props: true },
]

export default new VueRouter({
	routes // short for routes: routes
})
