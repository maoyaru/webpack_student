'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // NODE_ENV: '"http://10.220.22.201:8080"',
  NODE_ENV: '"development"',
  // NODE_ENV: '"http://192.168.1.139:8080"',
  PORT: '"localhost:9001"',
  title: '"Student"',
  bookTimeLimit: '"0"'
})
// https://dev.api.pplingo.com
