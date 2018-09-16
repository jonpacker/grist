const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV === 'development'

const app = express()

app.db = require('./lib/db')

// all environments
if (dev) app.use(require('morgan')('tiny'))
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

app.locals = {
  srm2hex: require('srm2hex'),
  _: require('underscore'),
  rp: require('round-precision')
}

require('./routes')(app)

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
