'use strict'

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const utils = require('./utils')
const config = require('../config');
const env = require('../config/location.env')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')
const portfinder = require('portfinder')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const devWebpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: config.dev.assetsPublicPath
  },
  mode: 'development',
  devServer: {
    proxy: config.dev.proxyTable,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            transformToRequire: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }        
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                import: [
                  path.join(__dirname, "../src/assets/theme-default/common/stylus/mixin.styl")
                ],
              }
            }
          }
        ]
      },
      {
        test: /\.stylus$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ].concat(utils.htmlPlugin())
}) 

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() :
          undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
