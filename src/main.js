import Vue from 'vue'
import App from './App.vue'
//import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/qvain.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faInfo, faMinus, faPlus, faAngleRight, faTimes, faQuoteLeft, faExclamationTriangle, faSync, faQuestionCircle, faDatabase, faPen, faTrash, faHistory, faClock, faCloudUploadAlt, faCircleNotch, faList, faListAlt, faUndo, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import router from './router.js'
import store from './store.js'
import AuthStore from './vuex/auth.js'
import FilesStore from './vuex/files.js'
import AuthPlugin from './auth/plugin.js'

Vue.use(BootstrapVue)

Vue.use(AuthPlugin, {
	router: router,
	loginPage: "/token",
})

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faUser, faInfo, faMinus, faPlus, faTimes, faAngleRight, faQuoteLeft, faExclamationTriangle, faSync, faQuestionCircle, faDatabase, faPen, faTrash, faHistory, faClock, faCloudUploadAlt, faCircleNotch, faList, faListAlt, faUndo, faExternalLinkAlt)

store.registerModule('auth', AuthStore)
store.registerModule('files', FilesStore)

// create and mount the root instance
// eslint-disable-next-line no-unused-vars
const app = new Vue({
	router,
	store,
	render: h => h(App),
	data: {
		user: null,
		language: null,
		dismissSecs: 5,
		dismissCountDown: 0,
		alertText: "hello there!",
		alertVariant: "dark",
	},
	methods: {
		countDownChanged (dismissCountDown) {
			this.dismissCountDown = dismissCountDown
		},
		showAlert (text, variant) {
			this.dismissCountDown = this.dismissSecs
			this.alertText = text
			this.alertVariant = variant || "dark"
		},
		dismissAlert () {
			this.dismissCountDown = 0
			this.alertText = null
			this.alertVariant = "dark"
		},
	},
	computed: {
		authenticated() {
			return this.user !== null
		},
	},
	watch: {
		language(val) {
			this.showAlert("language set to: " + val)
		}
	},
	created() {
		//this.language = "en"
		/*
		console.log("env:", process.env)
		console.log("MODE:", process.env.VUE_APP_MODE)
		console.log("METAX_API_URL:", process.env.VUE_APP_METAX_API_URL)
		console.log("ES_API_URL:", process.env.VUE_APP_ES_API_URL)
		console.log("ETSIN_API_URL:", process.env.VUE_APP_ETSIN_API_URL)
		console.log("APP_DEBUG:", typeof APP_DEBUG !== 'undefined' ? APP_DEBUG : undefined)
		console.log("NODE_ENV:", process.env.NODE_ENV)
		console.log("DEV_TOKEN:", process.env.VUE_APP_DEV_TOKEN)
		*/

		// we can't log in from a dev instance, so load a "fake" token
		//if (process.env.NODE_ENV === "development" && process.env.VUE_APP_DEV_TOKEN) {
		//	console.log("fake login:", this.$auth.login(process.env.VUE_APP_DEV_TOKEN))
		//}
		//console.log("localStorage token login:", this.$auth.localLogin(), this.$auth.loggedIn, this.$auth.user, this.$auth.user.name)
		//console.log("logged in?", this.$auth.loggedIn, this.$auth.user, this.$auth._user)
		console.log("login attempt with cached token:", this.$auth.localLogin())
	},
}).$mount('#app')
