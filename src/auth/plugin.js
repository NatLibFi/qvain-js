import Auth from './auth.js'

// addGlobalGuard adds a guard to Vue router that checks for a boolean requiresAuth on each route and, if necessary, sends the user to a login page if they are not logged in.
function addGlobalGuard(router, auth, loginPage) {
	if (!loginPage) {
		loginPage = "/login"
	}

	router.beforeEach((to, from, next) => {
		if (to.matched.some(record => record.meta.auth)) {
			// this route requires auth, check if logged in
			// if not, redirect to login page.
			if (!auth.loggedIn) {
				next({
					path: loginPage,
					query: { redirect: to.fullPath }
				})
			} else {
				next()
			}
		} else {
			next() // make sure to always call next()!
		}
	})
}

// plugin for Vue
// options:
//   router: <vue router object>
//   loginPage: <login page url>
function plugin(Vue, options) {
	if (plugin.installed) {
		return
	}
	plugin.installed = true

	if (!options) {
		options = {}
	}

	const auth = new Auth("plugin.com")

	if (options['router']) {
		addGlobalGuard(options.router, auth, options['loginPage'])
	}

	Object.defineProperty(Vue.prototype, '$auth', {
		//get () { return new Auth("url.com") }
		get () { return auth }
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin
