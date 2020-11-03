'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  // context: path.resolve(__dirname, '../'),
  entry: utils.entries(),
  // entry: {
  //   app: './src/main.js'
  // },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', 'styl'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  externals: {
    'vue': 'Vue',
    // 'element-ui': 'ElEMENT',
    'element-ui': 'ElementUI',
  }
}
