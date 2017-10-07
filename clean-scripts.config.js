const childProcess = require('child_process')
const util = require('util')
const mkdirp = require('mkdirp')

const execAsync = util.promisify(childProcess.exec)
const mkdirpAsync = util.promisify(mkdirp)

module.exports = {
  build: [
    {
      js: [
        `file2variable-cli index.template.html -o variables.ts --html-minify`,
        `tsc`,
        `webpack --display-modules`
      ],
      css: [
        `lessc index.less > index.css`,
        `postcss index.css -o index.postcss.css`,
        `cleancss -o index.min.css index.postcss.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`
      ],
      clean: `rimraf *.min-*.js index.min-*.css`
    },
    `rev-static`,
    [
      `sw-precache --config sw-precache.config.js --verbose`,
      `uglifyjs service-worker.js -o service-worker.bundle.js`
    ],
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const parse5 = require('parse5')
      const beautify = require('js-beautify').html
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })
      await page.goto(`http://localhost:8000`)
      await page.screenshot({ path: `screenshot.png`, fullPage: true })
      fs.writeFileSync(`screenshot-src.html`, beautify(await page.content()))

      await mkdirpAsync('screenshots')

      await page.focus('input')
      await page.type('Task 1', { delay: 100 })
      await page.press('Enter')
      await page.hover('.content')
      await page.waitFor(100)
      await page.screenshot({ path: `screenshots/new-task.png`, fullPage: true })
      fs.writeFileSync(`screenshots/src-new-task.html`, beautify(await page.content()))

      await page.hover('.content')
      await page.waitFor(100)
      await page.click('li button')
      await page.hover('.content')
      await page.waitFor(500)
      await page.screenshot({ path: `screenshots/on-it.png`, fullPage: true })
      fs.writeFileSync(`screenshots/src-on-it.html`, beautify(await page.content()))

      await page.hover('.content')
      await page.waitFor(100)
      await page.click('li button')
      await page.hover('.content')
      await page.waitFor(100)
      await page.screenshot({ path: `screenshots/done.png`, fullPage: true })
      let document = parse5.parse(await page.content())
      forEach(document, node => {
        if (node.attrs) {
          const attr = node.attrs.find(a => a.name === 'title')
          if (attr) {
            attr.value = '[title]'
          }
        }
      })
      fs.writeFileSync(`screenshots/src-done.html`, beautify(parse5.serialize(document)))

      await page.hover('.content')
      await page.waitFor(100)
      await page.click('li button')
      await page.hover('.content')
      await page.waitFor(100)
      await page.screenshot({ path: `screenshots/reopen.png`, fullPage: true })
      document = parse5.parse(await page.content())
      forEach(document, node => {
        if (node.attrs) {
          const attr = node.attrs.find(a => a.name === 'title')
          if (attr) {
            attr.value = '[title]'
          }
        }
      })
      fs.writeFileSync(`screenshots/src-reopen.html`, beautify(parse5.serialize(document)))

      await page.hover('.content')
      await page.waitFor(100)
      await page.click('li:nth-child(2) button:nth-child(5)')
      await page.waitFor(100)
      await page.hover('.content')
      await page.waitFor(100)
      await page.screenshot({ path: `screenshots/close.png`, fullPage: true })
      document = parse5.parse(await page.content())
      forEach(document, node => {
        if (node.attrs) {
          const attr = node.attrs.find(a => a.name === 'title')
          if (attr) {
            attr.value = '[title]'
          }
        }
      })
      fs.writeFileSync(`screenshots/src-close.html`, beautify(parse5.serialize(document)))

      server.close()
      browser.close()
    }
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
    'git checkout screenshot.png',
    'git checkout "screenshots/*.png"',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
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
  },
  prerender: [
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })
      await page.waitFor(1000)
      await page.goto('http://localhost:8000')
      await page.waitFor(1000)
      const content = await page.evaluate(() => {
        const element = document.querySelector('#prerender-container')
        return element ? element.innerHTML : ''
      })
      fs.writeFileSync('prerender.html', content)
      server.close()
      browser.close()
    },
    `clean-scripts build[1]`,
    `clean-scripts build[2]`
  ]
}

function forEach (node, callback) {
  callback(node)
  if (node.childNodes) {
    for (const childNode of node.childNodes) {
      forEach(childNode, callback)
    }
  }
}
