let server = require('./server').server
let socketIO = require('socket.io')
let api = require('./api')
let io = socketIO(server)

let players = []

io.on('connection', function (socket) {
  socket.on('join',(data)=>{
    let token = data.token
    if(token){
      api.GetUserByToken(token,(player)=>{
        if(player){
          players[socket.id] = player
          socket.emit('join',{status:true})
          io.emit('console',players[socket.id].login+' зашел на сервер')
        }else {
          socket.emit('join',{status:false})
        }
      })
    }
  })
  socket.on('disconnect',function () {
    if(players[socket.id]){
      api.DelToken(players[socket.id].token)
      io.emit('console',players[socket.id].login+' вышел с сервера')
      delete players[socket.id]
    }
  })


  //console
  socket.on('console',(data)=>{
    if(data[0] === '/'){
      let comand = data.slice(1, data.length).split(' ')
      switch (comand[0]) {
      case 'players':
        let message = 'Сейчас на сервере:'
        for(let player in players){
          message+=' ' + players[player].login+','
        }
        message = message.slice(0, message.length-1)
        socket.emit('console', message)
        break
      }
    }else{
      console.log(players[socket.id].login + ': ' + data)
      io.emit('console',players[socket.id].login+': '+data)
    }
  })
})

