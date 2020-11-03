const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

var glob = require('glob')
var PAGE_PATH = path.resolve(__dirname, '../src/pages')
let env;
if (process.argv[process.argv.length-1] == 'development') {
  env = 'development'
} else {
  env = 'production'
}


exports.entries = function() {
  var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
  var map = {}
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    map[filename] = filePath
  })
  return map
}


exports.htmlPlugin = function() {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let arr = []
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true,
      env: env
    }
    if (process.env.NODE_ENV === 'production') {
      // conf = merge(conf, {
      //   minify: {
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     removeAttributeQuotes: true
      //   },
      //   chunksSortMode: 'dependency'
      // })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}

exports.resolve = function(dir) {
  return path.join(__dirname, '..', dir)
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
