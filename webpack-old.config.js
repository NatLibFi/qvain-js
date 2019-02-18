// build file for Qvain Javascript code
//
// This webpack config file packs the javascript code for Qvain into two bundles:
//   - our javascript code and component files for widgets (all ES2015/ES6) get transpiled and bundled into app.bundle.js;
//   - needed libraries (mainly vue and vue-router) go into vendor.bundle.js.
//
// See also: vue webpack-simple template https://github.com/vuejs-templates/webpack-simple
const path = require('path')
const webpack = require('webpack')

//process.traceDeprecation = true;

function envToBool(envVar) {
	return process.env[envVar] === undefined || process.env[envVar] == "" || process.env[envVar] == "0" || process.env[envVar] == "false" || process.env[envVar] == "no" ? false : true
}

//const ISDEVBUILD = envToBool('APP_DEBUG');

// if APP_DEBUG is set to a true value, we are doing development; set NODE_ENV accordingly if not already set
if (process.env.NODE_ENV === undefined && process.env.APP_DEBUG !== undefined) {
	//var debugMode = process.env.APP_DEBUG === undefined || process.env.APP_DEBUG == "" || process.env.APP_DEBUG == "0" || process.env.APP_DEBUG == "no" ? false : true;
	//console.log("APP_DEBUG:", process.env.APP_DEBUG);
	//console.log("debugMode set to", debugMode);
	process.env.NODE_ENV = envToBool('APP_DEBUG') ? 'development' : 'production'
	console.log("NODE_ENV set to", process.env.NODE_ENV)
}

module.exports = {
	context: path.resolve(__dirname, './src'),
	entry: {
		app: './app.js',
		vendor: ['vue', 'vue-router'],
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			// .vue component files: code compiles into the source as modules, HTML parts get compiled to render functions for those respective components; we don't use CSS/SASS here!
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				/*
				options: {
					loaders: {
						{{#sass}}
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this necessary.
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
						{{/sass}}
					}
					// other vue-loader options go here
				}
				*/
			},
			// code is written in ES2015/ES6
			// see also: https://github.com/babel/babel-loader
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						/* ["es2015", { "modules": false }], */
						["env", { "modules": false }],
					],
					plugins: [require('babel-plugin-transform-object-rest-spread')],
				},
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			// ideally all modules would be in the es2015/ES6 format as it's the closest thing to a standard; ours are, but import'ed code in our app might not be, so we can't force it
			//
			// see also:
			//   https://hacks.mozilla.org/2015/08/es6-in-depth-modules/
			//   https://www.jvandemo.com/a-10-minute-primer-to-javascript-modules-module-formats-module-loaders-and-module-bundlers/
			//
			// formats (uneducated guess):
			//   amd: some browsers; commonjs: node (also called "cjs"); systemjs: ES6 backported to ES5; harmony: ES6; browserify: commonjs + node functions; requirejs: most popular implementation of amd
			{
				parser: {
					//amd: false,
					//commonjs: false,
					//systemjs: false,
					//harmony: false,
					//browserify: false,
					//requirejs: false,
				},
			},
		],
	},
	plugins: [
		// split libraries into a vendor bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			//filename: "vendor.js",
			//minChunks: 2,
		}),
		// define constants that get compiled into the application
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"',
				/* process.env.NODE_ENV !== 'production'; */
			},
			'APP_DEBUG': envToBool('APP_DEBUG'),
			'magicalnumber': 666,
			'SERVICE_URL': JSON.stringify("http://dev.example.com"),
		}),
	],
	resolve: {
		alias: {
			// refer to the ES6-formatted module of Vue, not the old Node format; Vue in Node comes in multiple module formats
			'vue$': 'vue/dist/vue.esm.js',
		},
	},
	externals: {
		//'bootstrap-vue': 'bootstrapVue',
		//BootstrapVue: 'bootstrapVue',
	},
	devtool: 'cheap-module-eval-source-map', /* 'eval-source-map' */
	node: {
		setImmediate: false,
	},
}

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	if (module.exports.resolve && module.exports.resolve.alias) {
		delete module.exports.resolve['vue$']
	}
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	])
}
