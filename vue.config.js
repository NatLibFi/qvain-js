const path = require('path')

module.exports = {
	lintOnSave: false,
	chainWebpack: config => {
		// make sure BABEL_ENV is set to whatever NODE_ENV is set to in .env files
		if (process.env.BABEL_ENV !== process.env.NODE_ENV) {
			//console.log("BABEL_ENV is not equal to NODE_ENV", process.env.BABEL_ENV)
			process.env.BABEL_ENV = process.env.NODE_ENV
		}

		// set global vars
		config
			.plugin('define')
				.tap(args => {
					Object.assign(args[0], {
						APP_DEBUG: JSON.stringify('zork'),
					})
					Object.assign(args[0]['process.env'], {
						VUE_APP_MODE: process.env.VUE_CLI_MODE
					})
					return args
				})

		// ignore old code in src/Attic/
		config
			.module
			.rule('attic')
			.exclude
				.add(path.resolve(__dirname, 'src', 'Attic'))
				.end()

		// vue-cli minifies html by default for production; don't
		if (process.env.NODE_ENV === 'production') {
			config
				.plugin('html')
					.tap(([options]) => [Object.assign(options, {
						minify: {
							removeComments: true,
							collapseWhitespace: false,
							conservativeCollapse: false,
							preserveLineBreaks: true,
							removeAttributeQuotes: false
						},
					})])
		}
	}
}
