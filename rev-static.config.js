module.exports = {
  inputFiles: [
    'index.min.js',
    'index.min.css',
    'index.ejs.html'
  ],
  excludeFiles: [
  ],
  outputFiles: file => file.replace('.ejs', ''),
  json: false,
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  noOutputFiles: [
  ],
  es6: false,
  less: false,
  scss: false,
  fileSize: 'file-size.json'
}
