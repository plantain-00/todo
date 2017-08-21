const childProcess = require('child_process')

module.exports = {
  build: [
    {
      js: [
        `file2variable-cli index.template.html -o variables.ts --html-minify`,
        `tsc`,
        `webpack --display-modules --config webpack.config.js`
      ],
      css: [
        `lessc index.less > index.css`,
        `cleancss -o index.min.css index.css  ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`
      ],
      clean: `rimraf *.min-*.js index.min-*.css`
    },
    `rev-static --config rev-static.config.js`,
    [
      `sw-precache --config sw-precache.config.js --verbose`,
      `uglifyjs service-worker.js -o service-worker.bundle.js`
    ]
  ],
  lint: {
    ts: `tslint "*.ts"`,
    js: `standard "**/*.config.js"`,
    less: `stylelint "**/*.less"`,
    export: `no-unused-export "*.ts"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => new Promise((resolve, reject) => {
      childProcess.exec('git status -s', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          if (stdout) {
            reject(new Error(`generated files doesn't match.`))
          } else {
            resolve()
          }
        }
      }).stdout.pipe(process.stdout)
    })
  ],
  fix: {
    ts: `tslint --fix "*.ts"`,
    js: `standard --fix "**/*.config.js"`,
    less: `stylelint --fix "**/*.less"`
  },
  watch: {
    template: `file2variable-cli index.template.html -o variables.ts --html-minify --watch`,
    src: `tsc --watch`,
    webpack: `webpack --watch`,
    less: `watch-then-execute "index.less" --script "clean-scripts build[0].css"`,
    rev: `rev-static --watch`,
    sw: `watch-then-execute "vendor.bundle-*.js" "index.html" "worker.bundle.js" --script "clean-scripts build[2]"`
  }
}
