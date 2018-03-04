module.exports = {
  entry: {
    index: './index'
  },
  output: {
    path: __dirname,
    filename: '[name].min.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}
