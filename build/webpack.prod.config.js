'use strict'

const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const chalk = require('chalk')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const utils = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.config')
const ora = require('ora')
const spinner = ora('building for production...')
spinner.start()


let env
if (process.argv[process.argv.length-1] == 'development') {
  env = require('../config/dev.env')
} else {
  env = require('../config/prod.env')
}
process.env.NODE_ENV = 'production'

const prodWebpackConfig = merge(baseWebpackConfig, {
  // context: path.resolve(__dirname, '../'),
  output: {
    path: utils.resolve('dist'),
    filename: 'static/js/[name].[contenthash].js',
    // chunkFilename: 'static/js/[name].[contenthash].js',
    publicPath: env.NODE_ENV === '"production"' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
      minSize: 30000, // 最小尺寸，30000
      minChunks: 2, // 最小 chunk ，默认1
      maxAsyncRequests: 5, // 最大异步请求数， 默认5
      maxInitialRequests : 3, // 最大初始化请求书，默认3
      automaticNameDelimiter: '~',// 打包分隔符
      name: function(){}, // 打包后的名称，此选项可接收 function
      cacheGroups:{ // 这里开始设置缓存的 chunks
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        // elliptic: {
        //   chunks: "all",
        //   minChunks: 2,
        //   test: /elliptic/,
        //   name: 'elliptic'
        // },
        // moment: {
        //   chunks: "all",
        //   minChunks: 2,
        //   test: /moment/,
        //   name: 'moment'
        // }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  devtool: false,
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: 'static/img/[name].[contenthash].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/fonts/[name].[contenthash].[ext]'
          }
        }],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      // chunkFilename: 'static/css/[name].[contenthash].css',
      ignoreOrder: true,
      esModule: false
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'static/*/*',
          to: '../dist',
        },
      ],
    }),
    // new BundleAnalyzerPlugin()
  ].concat(utils.htmlPlugin()),
}) 

webpack(prodWebpackConfig, (err, status) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(status.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  if (status.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})