let express = require('express')
let cors = require('cors')
let http = require('http')
let bodyParser = require('body-parser')
let config = require('./config.js')
let api = require('./api')


let app = express()
let server = http.Server(app)


app.use(cors())
app.set('port', config.port)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get('/', api.Home)
app.post('/auth', api.Auth)
app.post('/reg', api.Reg)
app.post('/logout', api.Logout)

api.ClearAllTokens()

module.exports.server = server

server.listen(config.port, function () {
  console.log('Server run on port ' + config.port)
})





