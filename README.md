
# Qvain
-------

Qvain is the metadata editor for the [Fairdata](https://www.fairdata.fi/en/) project by the [Finnish Ministry of Education and Culture](https://minedu.fi/en/). It has been developed by the [National Library of Finland](https://www.kansalliskirjasto.fi/en). It has a front-end written in Javascript and back-end written in [Go](https://golang.org/). This repository contains the javascript front-end.

The user interface uses the minimal [Vue](https://vuejs.org/) UI framework and related libraries [Vue router](https://router.vuejs.org/) and [Vuex state management](https://vuex.vuejs.org/) to update the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) to handle different steps of the editing process. The application is written in [ES6](https://kangax.github.io/compat-table/es6/) (also called ECMAScript 2015), the latest standard of Javascript, and packaged into a bundle for the browser by [webpack](https://webpack.js.org/) and [babel](https://babeljs.io/).


## Prerequisites & dependencies

Services:

- Schema service: Qvain needs a schema to build its metadata input interface from; this schema comes from the [iow service](http://iow.csc.fi/model/mrd/)
- ATT id/login service: the Qvain frontend doesn't handle login, it expects a [JSON web token](https://jwt.io/) to assert the user's identity, which the backend provides


## Getting up and running

### Requirements

You need to have a reasonably recent version of node and (usually included) npm – the Node Package Manager – installed.

Most Javascript development uses [node](https://nodejs.org/) as engine to run the actual Javascript and its package manager [npm](https://www.npmjs.com/) to install dependencies. You can also use [yarn](https://yarnpkg.com/) to manage package dependencies, but the instructions here are for npm.

### Install dependencies

First, clone this repository and install the dependencies listed in [package.json](package.json):

```shell
$ git clone https://.../qvain-js
$ cd qvain-js
$ npm install
[... npm downloads the whole internet ...]
```

When npm finishes, you should have everything you need to run Qvain.


### Build for development

To run the application for development on localhost, run the npm `serve` script:

```shell
$ npm run serve
 DONE  Compiled successfully in 11715ms                                                                                                                                                                                                                                                       16:50:53


   App running at:
     - Local:   http://localhost:8080/
     - Network: unavailable

   Note that the development build is not optimized.
   To create a production build, run npm run build.
```

... and open a browser window at http://localhost:8080/.


### Building dist packages

To build packages that can be uploaded to a server, run the npm `build` script:

```shell
$ npm run build
```

... it will build and bundle files into `./dist`. The contents of this directory is what your production web server should serve.


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

Qvain is a modern [SPA](https://en.wikipedia.org/wiki/Single-page_application) web application written in ES6 (anno 2015) compliant Javascript and transpiled by Webpack and Babel. [The build process creates two bundles](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/): a faster and smaller one with modern ES6 Javascript for browsers supporting Javascript modules – all of the current self-updating browsers – and a slower and larger bundle with code transpiled to ES5 with optional polyfills for old browsers, in an attempt to support those people stuck with old browsers such as IE11.

Note that because Qvain depends on [Vue](https://vuejs.org/v2/guide/installation.html#Compatibility-Note) and [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/browsers-devices/#supported-browsers), it is very unlikely to work on versions of Internet Explorer older than IE10. In short, run Qvain in an [evergreen browser](https://www.w3.org/2001/tag/doc/evergreen-web/).


## License

Qvain metadata description tool
Copyright (c) 2016–2019 National Library of Finland
Licensed under the GPL 3.0