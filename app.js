const express = require('express')
const routes = require('./routes')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV === 'development'

const app = express()

// all environments
if (dev) app.use(require('morgan')('tiny'))
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(app.router)
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

app.put('/', routes.replaceRecipe)
app.post('/', routes.importBeerXml)
app.get('/:slug', routes.readRecipe)
app.del('/:slug', routes.deleteRecipe)
app.get('/json/:slug', routes.getRecipeJson)

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
