module.exports = {
  build: [
    {
      clean: `rimraf *.min-*.js index.min-*.css`,
      js: [
        `file2variable-cli index.template.html -o variables.ts --html-minify`,
        `tsc`,
        `webpack --display-modules --config webpack.config.js`
      ],
      css: [
        `lessc index.less > index.css`,
        `cleancss -o index.min.css index.css  ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`
      ]
    },
    `rev-static --config rev-static.config.js`,
    `sw-precache --config sw-precache.config.js --verbose`,
    `uglifyjs service-worker.js -o service-worker.bundle.js`
  ],
  lint: {
    ts: `tslint "*.ts"`,
    js: `standard "**/*.config.js"`,
    less: `stylelint "**/*.less"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: {
    js: `standard --fix "**/*.config.js"`,
    less: `stylelint --fix "**/*.less"`
  }
}
