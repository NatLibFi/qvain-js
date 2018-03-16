#!/bin/sh
#
# -wvh- built js shit because node doesn't understand ES6 modules
#

#../../node_modules/babel-cli/bin/babel.js -w --no-babelrc test.js --out-file build.js --presets=es2015
../../node_modules/babel-cli/bin/babel.js -w --no-babelrc src --out-dir build --presets=es2015
