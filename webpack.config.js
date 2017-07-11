const webpack = require('webpack')

module.exports = {
  entry: {
    index: './index',
    vendor: './vendor'
  },
  output: {
    path: __dirname,
    filename: '[name].min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['index', 'vendor']
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  }
}
