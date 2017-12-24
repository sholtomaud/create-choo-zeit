#!/usr/bin/env node

let mapLimit = require('async-collection/map-limit')
let series = require('async-collection/series')
let ansi = require('ansi-escape-sequences')
let minimist = require('minimist')
let dedent = require('dedent')
let rimraf = require('rimraf')
let path = require('path')

let lib = require('./')

let TRAIN = '🚂🚋🚋'

let USAGE = `
  $ ${clr('create-choo-zeit', 'bold')} ${clr('<project-directory>', 'green')} [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo application
    ${clr('$ create-choo-zeit', 'cyan')}

  Running into trouble? Feel free to file an issue:
  ${clr('https://github.com/choojs/create-choo-zeit/issues/new', 'cyan')}

  Do you enjoy using this software? Become a backer:
  ${clr('https://opencollective.com/choo', 'cyan')}
`.replace(/\n$/, '').replace(/^\n/, '')

let NODIR = `
  Please specify the project directory:
    ${clr('$ create-choo-zeit', 'cyan')} ${clr('<project-directory>', 'green')}

  For example:
    ${clr('$ create-choo-zeit', 'cyan')} ${clr('my-choo-app', 'green')}

  Run ${clr('create-choo-zeit --help', 'cyan')} to see all options.
`.replace(/\n$/, '').replace(/^\n/, '')

let argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    quiet: 'q',
    version: 'v'
  },
  boolean: [
    'help',
    'quiet',
    'version'
  ]
})

;(function main (argv) {
  let dir = argv._[0]

  if (argv.help) {
    console.log(USAGE)
  } else if (argv.version) {
    console.log(require('./package.json').version)
  } else if (!dir) {
    console.log(NODIR)
    process.exit(1)
  } else {
    create(path.join(process.cwd(), dir), argv)
  }
})(argv)

function create (dir, argv) {
  let written = []
  let scriptsDir = dir;
  let cmds = [
    function (done) {
      print('Creating a new Choo app in ' + clr(dir, 'green') + '.\n')
      lib.mkdir(dir, done)
    },
    function (done) {
      let filename = 'package.json'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writePackage(dir, done)
    },
    function (done) {
      print('\nInstalling packages, this might take a couple of minutes.')
      written.push(path.join(dir, 'node_modules'))
      var pkgs = [
        'choo',
        'choo-devtools',
        'choo-service-worker',
        'sheetify',
        'tachyons',
        'serve'
      ]
      let msg = clrInstall(pkgs)
      print('Installing ' + msg + '…')
      lib.install(dir, pkgs, done)
    },
    function (done) {
      var pkgs = [
        'bankai',
        'choo-scaffold',
        'dependency-check',
        'standard'
      ]
      let msg = clrInstall(pkgs)
      print('Installing ' + msg + '…')
      lib.devInstall(dir, pkgs, done)
    },
    function (done) {
      print('')
      let filename = '.gitignore'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeIgnore(dir, done)
    },
    function (done) {
      let filename = 'README.md'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeReadme(dir, done)
    },
    function (done) {
      let filename = 'index.js'
      printFile(filename)
      written.push(path.join(scriptsDir, filename))
      lib.writeIndex(scriptsDir, done)
    },
    function (done) {
      var filename = 'stores/clicks.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeStore(dir, done)
    },
    function (done) {
      var filename = 'sw.js'
      printFile(filename)
      written.push(path.join(scriptsDir, filename))
      lib.writeServiceWorker(scriptsDir, done)
    },
    function (done) {
      let filename = 'views/main.js'
      printFile(filename)
      written.push(path.join(scriptsDir, filename))
      lib.writeMainView(scriptsDir, done)
    },
    function (done) {
      let filename = 'views/404.js'
      printFile(filename)
      written.push(path.join(scriptsDir, filename))
      lib.writeNotFoundView(scriptsDir, done)
    },
    function (done) {
      let filename = 'manifest.json'
      printFile(filename)
      written.push(path.join(scriptsDir, filename))
      lib.writeManifest(scriptsDir, done)
    },
    function (done) {
      let filename = 'assets/icon.png'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeIcon(dir, done)
    },
    function (done) {
      let message = 'The train has departed! :steam_locomotive::train::train::train:'
      print('\nInitializing ' + clr('git', 'cyan'))
      written.push(path.join(dir, '.git'))
      lib.createGit(dir, message, done)
    }
  ]

  series(cmds, function (err) {
    if (err) {
      print('\nAborting installation. The following error occured:')
      print('  ' + clr(err.message, 'red') + '\n')
      mapLimit(written, 1, cleanFile, function (err) {
        if (err) throw err
        console.log('Cleanup completed, please try again sometime.')
        process.exit(1)
      })
    } else {
      let msg = dedent`
        App created in ${clr(dir, 'green')}.
        ${clr('All done, good job!', 'magenta')} ${TRAIN}

        The following commands are available:
          ${clr('npm run dev', 'cyan')}      Start the development server
          ${clr('npm start', 'cyan')}        Start the file server
          ${clr('npm run deploy', 'cyan')}   Deploy using now
          ${clr('npm test', 'cyan')}         Lint, validate deps & run tests
          ${clr('npm run build', 'cyan')}    Compile all files to ${clr('dist/', 'green')}
          ${clr('npm run inspect', 'cyan')}  Inspect the bundle dependencies

        Do you enjoy using choo? Become a backer:
        ${clr('https://opencollective.com/choo', 'cyan')}
      `.replace(/\n$/g, '')
      print('\n' + msg)
    }
  })

  function print (val) {
    if (!argv.quiet) console.log(val)
  }

  function printFile (filename) {
    print('Creating file ' + clr(filename, 'cyan') + '…')
  }
}

function clr (text, color) {
  return process.stdout.isTTY ? ansi.format(text, color) : text
}

function clrInstall (pkgs) {
  return pkgs.reduce(function (str, pkg, i) {
    pkg = clr(pkg, 'cyan')
    if (i === pkgs.length - 1) {
      return str + pkg
    } else if (i === pkgs.length - 2) {
      return str + pkg + ', and '
    } else {
      return str + pkg + ', '
    }
  }, '')
}

function cleanFile (file, cb) {
  console.log('Deleting generated file… ' + clr(path.basename(file), 'cyan'))
  rimraf(file, cb)
}
