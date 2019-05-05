let server = require('./server').server
let socketIO = require('socket.io')
let io = socketIO(server)


io.on('connection', function (socket) {
  console.log('new connection')
})

