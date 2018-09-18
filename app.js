const http = require('http')
const app = require('./server')
http.createServer(app).listen(process.env.PORT || 3000, function () {
  console.log('Express server listening on port ' + app.get('port'))
})
