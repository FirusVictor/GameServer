let express = require('express')
let cors = require('cors')
let http = require('http')
let socketIO = require('socket.io')
let bodyParser = require('body-parser')
let config = require('./config.js')

let app = express()
let server = http.Server(app)
let io = socketIO(server)

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('test')
})


let players = []


io.on('connection', function (socket) {
  console.log('new connection')
})


server.listen(config.port, function () {
  console.log('Server run on port ' + config.port)
})
