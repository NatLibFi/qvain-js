const path = require('path')

module.exports = {
	lintOnSave: false,
	chainWebpack: config => {
		// set global vars
		config
			.plugin('define')
				.tap(args => {
					Object.assign(args[0], {
						APP_DEBUG: JSON.stringify('zork')
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
