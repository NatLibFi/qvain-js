import Auth from './auth.js'

// addGlobalGuard adds a hook to Vue router that checks for a boolean `auth` on each route and, if necessary, sends the user to a login page if they are not logged in.
function addGlobalGuard(router, auth, loginPage) {
	if (!loginPage) {
		loginPage = "/login"
	}

	router.beforeEach((to, from, next) => {
		console.log("router: logged in?", auth.loggedIn)
		// if the route needs authentication...
		if (to.matched.some(record => record.meta.auth)) {
			// this route requires auth, check if logged in
			// if not, redirect to login page.
			console.log("router (must): logged in?", auth.loggedIn)
			// if not logged in, try token in local storage, else send to login page
			if (!auth.loggedIn && !auth.localLogin()) {
				next({
					path: loginPage,
					query: { redirect: to.fullPath }
				})
			} else {
				next() // success, next
			}
		} else {
			next() // no auth needed, next
		}
	})
}

// plugin for Vue
// options:
//   router: vue router object
//   loginUrl: url to login api
//   cbUrl: url to component that handles token callback
function plugin(Vue, options) {
	if (plugin.installed) {
		return
	}
	plugin.installed = true

	if (!options) {
		options = {}
	}

	if (Vue.util && Vue.util.defineReactive) {
		Auth.prototype.defineProperty = Vue.util.defineReactive
	} else {
		console.warn("auth plugin: Vue.util.defineReactive not found on Vue instance")
	}

	const auth = new Auth(options.loginUrl)

	if (options['router']) {
		addGlobalGuard(options.router, auth, options['cbUrl'])
	}

	Object.defineProperty(Vue.prototype, '$auth', {
		get () { return auth }
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin
