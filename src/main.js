import Vue from 'vue'
import App from './App.vue'
//import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

import router from './router.js'
import store from './store.js'
import AuthStore from './vuex/auth.js'
import FilesStore from './vuex/files.js'
import AuthPlugin from './auth/plugin.js'

/*
import vWelcome from './v-welcome.vue'
import vEditor from './v-editor.vue'
import vLister from './v-lister.vue'
import vSchema from './v-schema.vue'
import vSchemaForm from './v-schema-form.vue'
import refdataWidgets from './widgets/plugin-ui-refdata.js'
*/

Vue.use(BootstrapVue)

//Vue.use(refdataWidgets)

Vue.use(AuthPlugin)

store.registerModule('auth', AuthStore)
store.registerModule('files', FilesStore)

// eslint-disable-next-line no-unused-vars
const testJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNTNiZmZiY2M0MWVkYWQ0ODUzYmVhOTFmYzQyZWExOCIsIm5hbWUiOiJXb3V0ZXIgVmFuIEhlbWVsIiwiYWRtaW4iOnRydWV9.SzRhDZOKW2l1Y5VTNin43vxfbZ86QXhPVULpidMVyE8"


// create and mount the root instance
// eslint-disable-next-line no-unused-vars
const app = new Vue({
	router,
	store,
	render: h => h(App),
	data: {
		"user": null,
		//"DEBUG": APP_DEBUG,
	},
	methods: {
	},
	computed: {
		authenticated: function() {
			return this.user !== null
		},
	},
	created: function() {
		console.log("METAX_API_URL:", process.env.VUE_APP_METAX_API_URL)
		console.log("APP_DEBUG:", typeof APP_DEBUG !== 'undefined' ? APP_DEBUG : undefined)
	},
}).$mount('#app')
