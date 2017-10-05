# create-choo-app for zeit
[![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a fresh choo application for use with zeit. It installs [choo](https://github.com/choojs/choo), along with:

- [bankai](https://github.com/choojs/bankai), an asset bundler and static file server
- [sheetify](https://github.com/stackcss/sheetify/), a CSS bundler
- [choo-log](https://github.com/choojs/choo-log) and [choo-devtools](https://github.com/choojs/choo-devtools), to improve the development experience
- [choo-service-worker](https://github.com/choojs/choo-service-worker), for offline support
- [tachyons](http://tachyons.io/), a minimalist CSS toolkit
- [standard](https://standardjs.com/), a JavaScript linter
- [serve](https://www.npmjs.com/package/serve), a zeit file server
- [dependency-check](https://github.com/maxogden/dependency-check), to verify your dependencies are listed in `package.json`

## Usage
Example of how to install a test choo.js app locally.

```sh
$ npx create-choo-zeit <project-directory>
```

Example of how to install the test locally and then deploy the test app to zeit. It should all just work.

```sh
$ npx create-choo-zeit <project-directory> && cd <project-directory>  && npm run deploy
```

## API
```txt
  $ create-choo-zeit <project-directory> [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo application
    $ create-choo-zeit

  Running into trouble? Feel free to file an issue:
  https://github.com/shotlom/create-choo-zeit/issues/new

```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/create-choo-zeit.svg?style=flat-square
[3]: https://npmjs.org/package/create-choo-zeit
[4]: https://img.shields.io/travis/choojs/create-choo-zeit/master.svg?style=flat-square
[5]: https://travis-ci.org/choojs/create-choo-zeit
[6]: https://img.shields.io/codecov/c/github/choojs/create-choo-zeit/master.svg?style=flat-square
[7]: https://codecov.io/github/choojs/create-choo-zeit
[8]: http://img.shields.io/npm/dm/create-choo-zeit.svg?style=flat-square
[9]: https://npmjs.org/package/create-choo-zeit
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
