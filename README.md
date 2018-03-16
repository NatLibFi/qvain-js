
# Qvain
-------

Qvain is the metadata editor for the [ATT project](http://avointiede.fi/). It has a front-end written in Javascript and back-end written in [Go](https://golang.org/). This repository contains the javascript front-end.

The user frontend uses the minimal [Vue library](https://vuejs.org/) to update the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) and its official [Vue-router](https://router.vuejs.org/) component to handle different steps of the editing process. The application is written in [ES6](https://kangax.github.io/compat-table/es6/) (also called ECMAScript 2015), the latest standard of Javascript, and packaged into a bundle for the browser by [webpack 2](https://webpack.js.org/) and [babel](https://babeljs.io/).


## Prerequisites & dependencies

For development (building the bundle):

- npm/yarn: you need a javascript package managment system to load the needed development modules
- webpack: a bundle packer like webpack enables you to define imports/exports and hence spread code over multiple files instead of having one huge javascript script
- babel: babel is used by webpack to convert the ES6 code into something most browsers support

Runtime:

- vue: ui
- vue-router: ui
- bootstrap-vue: ui
- date-fns (pending): relative and pretty dates

Browser support:

- IE: perhaps (at least v10)
- Edge: probably (all versions)
- Safari: likely (at least v8)
- Firefox: yes (at least v38)
- Chrome: yes (at least v43)

Note: IE8 and earlier are not supported at all. Apart from our own application code, Vue demands a ES5 compatible browser (at least IE9) and Bootstrap 4 at least IE10–IE11. Avoid Internet Explorer for modern web applications; any newer self-updating browser should work.

Services:

- Schema service: Qvain needs a schema to build its metadata input interface from; this schema comes from the [iow service](http://iow.csc.fi/model/mrd/)
- ATT id/login service: the Qvain frontend doesn't handle login, it expects a [JSON web token](https://jwt.io/) to assert the user's identity, which the backend provides


## Code layout

- The application's code lives in the `src/` directory.
- The `app.js` file is the main entrypoint of the application.
- Files ending in `.vue` are vue components, meaning they export a Vue object and have both template and javascript code for a UI component of the application.
- Any file starting with `v-` exports a Vue component.
- Other javascript files are pure javascript code written in ES6 module style.
- Package dependencies can be found in the standard NPM `package.json` file.
- Webpack configuration file `webpack.config.js` builds the application in an app and vendor bundle for the browser and puts the resulting bundles in `dist/`.
- You can find the html index file `app.html` in the main folder; this file will load the bundles and start the application in the browser.


## Building

Make sure you have `npm` – the [Node Package Manager](https://www.npmjs.com/) – installed. Qvain does not depend on Node itself but its package manager has become a defacto standard for installing javascript libraries and is included in most Linux distributions.

Create a local package cache by simply running `npm install webpack` in the application's base directory. It will create `./node_modules/` in the current directory where it will store installed javascript packages.

You can then build the code with webpack, which you would probably have installed in your local node directory:

```shell
./node_modules/.bin/webpack --config webpack.config.js
```

If you are developing the application, you can avoid manually re-packaging the code by running webpack with the watch option, which will continuously rebuild the bundles when you make any changes to source files:

```shell
./node_modules/.bin/webpack --watch --config webpack.config.js
```

... then point your browser to the `app.html` file in the main directory. Any changes you make should show up immediately in the browser – pending a reload, of course.
