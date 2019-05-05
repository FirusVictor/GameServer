let mongoose = require('mongoose')
let sha1 = require('sha1')
mongoose.connect('mongodb://127.0.0.1/myproject')
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
let UserModel = require('./models/User')

module.exports = {
  Home:(req,res)=>{
    res.send("Hello!!! It's fucking magic!")
  },
  Auth:(req,res)=>{
    let data = req.body
    let query = UserModel.find({login:data.login,pass:data.pass})
    query.exec((err,docs)=>{
      if(err){
        console.log('error in db: '+err)
        res.send({
          status:false,
          error:'error db'
        })
      }else{
        if(docs.leading>0){
          //Пользователь найден
          let token = GetToken()
          docs[0].update({$set:{token:token}},(err,docs)=>{
            if(err){
              console.log('error in db: '+err)
              res.send({
                status:false,
                error:'error db'
              })
            }else{
              res.send({
                status:true,
                token:token
              })
            }
          })
        }else{
          //Не правильный логин/пароль
          res.send({
            status:false,
            error:'login/pass invalid'
          })
        }
      }
    })
  },
  Reg:(req,res)=>{
    let data = req.body
    if(data.login.length>0 && data.pass.length>0){
      UserModel.find({login:data.login}).exec((err,docs)=>{
        if(err){
          console.log('error in db: '+err)
          res.send({
            status:false,
            error:'error db'
          })
        }else{
          if(docs.length>0){
            //логин занят
            res.send({
              status:false,
              error:'login already exist'
            })
          }else{
            //логин свободен
            let token = GetToken()
            let newUser = new UserModel({
              login:data.login,
              pass:data.pass,
              token: token
            })
            newUser.save().then((err)=>{
              if(err){
                console.log('error save new user')
                res.send({
                  status:false,
                  error:'error db'
                })
              }else{
                res.send({
                  status:true,
                  token:token
                })
              }
            })
          }
        }
      })
    }
  },
  Logout:(req,res)=>{
    let token = req.body.token
    if(token){
      UserModel.update({token:token},{$unset:{token:1}},(err,docs)=>{
        if(err){
          res.send({
            status:false,
            error:'error in db'
          })
        }else{
          res.send({
            status:true
          })
        }
      })
    }else{
      res.send({
        status:false,
        error:'bad query'
      })
    }
  },
}
function GetToken() {
  return sha1(Math.random()*Math.random()*Math.random())
}
