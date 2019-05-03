import Vue from 'vue'
import App from './App.vue'
//import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/qvain.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//import { faUser, faInfo, faMinus, faPlus, faAngleRight, faTimes, faQuoteLeft, faExclamationTriangle, faSync, faQuestionCircle, faDatabase, faPen, faTrash, faHistory, faClock, faCloudUploadAlt, faCircleNotch, faList, faListAlt, faUndo, faExternalLinkAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

import router from './router.js'
import store from './store.js'
import FilesStore from './vuex/files.js'
import AuthPlugin from './auth/plugin.js'

Vue.use(BootstrapVue)

Vue.use(AuthPlugin, {
	router: router,
	loginUrl: "/api/auth/login",
	cbUrl: "/token",
})

Vue.component('font-awesome-icon', FontAwesomeIcon)
//library.add(faUser, faInfo, faMinus, faPlus, faTimes, faAngleRight, faQuoteLeft, faExclamationTriangle, faSync, faQuestionCircle, faDatabase, faPen, faTrash, faHistory, faClock, faCloudUploadAlt, faCircleNotch, faList, faListAlt, faUndo, faExternalLinkAlt, faEllipsisV)
library.add(fas)

store.registerModule('files', FilesStore)

// get configuration from environment
function getConfig() {
	return {
		// Metax Dataset API endpoint
		MetaxApiUrl: process.env['VUE_APP_METAX_API_URL'],
		// Elastic Search API endpoint
		EsApiUrl: process.env['VUE_APP_ES_API_URL'],
		// Etsin Dataset API endpoint
		EtsinApiUrl: process.env['VUE_APP_ETSIN_API_URL'],
		// Qvain (js) version
		Version: process.env['VUE_APP_VERSION'],
		// application execution environment (testing, stable, production)
		Environment: process.env['VUE_APP_ENVIRONMENT'],
		// node environment
		NodeEnv: process.env['NODE_ENV'],
		// development login token
		DevToken: process.env['DEV_TOKEN'],
	}
}

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
		},
	},
	created() {
		//this.language = "en"

		// we can't log in from a dev instance, so load a "fake" token
		//if (process.env.NODE_ENV === "development" && process.env.VUE_APP_DEV_TOKEN) {
		//	console.log("fake login:", this.$auth.login(process.env.VUE_APP_DEV_TOKEN))
		//}
		//console.log("localStorage token login:", this.$auth.localLogin(), this.$auth.loggedIn, this.$auth.user, this.$auth.user.name)
		//console.log("logged in?", this.$auth.loggedIn, this.$auth.user, this.$auth._user)

		// set configuration on root component
		this.$config = getConfig()
	},

	mounted() {
		// load Matomo script, add a PageView
		if (process.env['VUE_APP_MATOMO_SITE_ID']) {
			window._paq = []
			_paq.push(['trackPageView'])
			_paq.push(['enableLinkTracking']);
			(function() {
				var u= "//matomo.rahtiapp.fi/"
				_paq.push(['setTrackerUrl', u +'piwik.php'])
				_paq.push(['setSiteId', process.env['VUE_APP_MATOMO_SITE_ID']])
				var d=document,
					g=d.createElement('script'),
					s=d.getElementsByTagName('script')[0]
				g.type='text/javascript'
				g.async=true
				g.defer=true
				g.src= u+'piwik.js'
				s.parentNode.insertBefore(g,s)
			})()
		}
	}
}).$mount('#app')
