const fs = require('fs')

module.exports = {
  inputFiles: [
    '*.min.js',
    'index.min.css',
    'index.ejs.html'
  ],
  excludeFiles: [
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'index.min.js',
    'index.min.css'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json',
  context: {
    prerender: fs.readFileSync('prerender/index.html')
  }
}
