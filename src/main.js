import Vue from 'vue'
import App from './App.vue'
//import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/qvain.scss'

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
		//"DEBUG": APP_DEBUG,
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
			this.showAlert("language set to " + val)
			console.log("language set to", this.language)
		}
	},
	created() {
		//this.language = "en"
		console.log("MODE:", process.env.VUE_APP_MODE)
		console.log("METAX_API_URL:", process.env.VUE_APP_METAX_API_URL)
		console.log("APP_DEBUG:", typeof APP_DEBUG !== 'undefined' ? APP_DEBUG : undefined)
		console.log("NODE_ENV:", process.env.NODE_ENV)
		console.log("DEV_TOKEN:", process.env.VUE_APP_DEV_TOKEN)
		console.log("localStorage token login:", this.$auth.localLogin(), this.$auth.loggedIn)
	},
}).$mount('#app')
