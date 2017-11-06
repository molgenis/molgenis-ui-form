var path = require('path')
var webpack = require('webpack')
var base = require('./base')
var config = module.exports = Object.assign({}, base)

Object.assign(config, {
  externals: {
    vue: 'vue'
  },
  entry: {
    'molgenis-vue-forms': './src/components/MolgenisForm.vue'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'molgenis-vue-forms',
    libraryTarget: 'umd'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})