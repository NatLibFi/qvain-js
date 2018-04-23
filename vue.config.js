module.exports = {
	lintOnSave: false,
	chainWebpack: config => {
		config
			.plugin('define')
      	.use(require('webpack/lib/DefinePlugin.js'), [{APP_DEBUG: JSON.stringify('zork')}])

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
