'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  bookTimeLimit: '"0"'
})
// https://dev.api.pplingo.com
