
# Qvain
-------

Qvain is the metadata editor for the [ATT project](http://avointiede.fi/). It has a front-end written in Javascript and back-end written in [Go](https://golang.org/). This repository contains the javascript front-end.

The user frontend uses the minimal [Vue library](https://vuejs.org/) to update the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) and its official [Vue-router](https://router.vuejs.org/) component to handle different steps of the editing process. The application is written in [ES6](https://kangax.github.io/compat-table/es6/) (also called ECMAScript 2015), the latest standard of Javascript, and packaged into a bundle for the browser by [webpack](https://webpack.js.org/) and [babel](https://babeljs.io/).


## Prerequisites & dependencies

Services:

- Schema service: Qvain needs a schema to build its metadata input interface from; this schema comes from the [iow service](http://iow.csc.fi/model/mrd/)
- ATT id/login service: the Qvain frontend doesn't handle login, it expects a [JSON web token](https://jwt.io/) to assert the user's identity, which the backend provides


## Build for development

To run the application for development on localhost, run the npm `serve` script:

```shell
$ npm run serve
```

... and open a browser window at http://localhost:8080/.


## Building dist packages

To build packages that can be uploaded to a server, run the npm `build` script:

```shell
$ npm run build
```

... it will build and package files into `./dist`. The contents of this directory is what your production web server should serve.


## Releasing a version

To release a version, forcefully add the `./dist` folder as it is ignored by default and either tag or commit:

```shell
$ npm run build
$ git add -f dist/
$ git tag -a v0.8.0 -m "Release 0.8.0"
$ git push -v
```


## Validator

Qvain contains a json-schema validator (sub) package in the `vendor/` directory. The validator has its own test suite based on Mocha and node's assert:

```shell
$ cd vendor/validator
$ npm test
```


## Browser support

Qvain, being a modern web application, makes quite heavy use of Javascript and needs a modern standards-compliant browser. During development it is tested with Firefox and Chrome. IE11 might work with a lot of support from polyfills, but it is not advised. Earlier browsers, especially IE8 and earlier, are not supported at all. Apart from our own application code, Vue demands a ES5 compatible browser (at least IE9) and Bootstrap 4 at least IE10–IE11. Avoid Internet Explorer for modern web applications; any newer self-updating browser (including Edge) should work.
