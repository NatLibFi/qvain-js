import Auth from './auth.js'

function plugin(Vue, options) {
	if (plugin.installed) {
		return
	}
	plugin.installed = true

	if (!options) {
		options = {}
	}

	var auth = new Auth("plugin.com")

	Object.defineProperty(Vue.prototype, '$auth', {
		//get () { return new Auth("url.com") }
		get () { return auth }
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin
