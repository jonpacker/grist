const express = require('express')
const path = require('path')
const dev = process.env.NODE_ENV === 'development'
const pug = require('pug')
const fs = require('fs')

const app = express()

app.db = require('./lib/db')

if (dev) app.use(require('morgan')('tiny'))
if (dev) app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/public')))

app.locals = {
  srm2hex: require('srm2hex'),
  _: require('underscore'),
  rp: require('round-precision')
}

app.templates = {
  index: pug.compileFile(path.join(__dirname, 'views/index.pug'))
}

require('./routes')(app)

module.exports = app
