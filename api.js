let mongoose = require('mongoose')
let sha1 = require('sha1')
mongoose.connect('mongodb://127.0.0.1/myproject',{ useNewUrlParser: true })
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
let UserModel = require('./models/User')

module.exports = {
  ClearAllTokens:()=>{
    UserModel.updateMany({},{$unset:{token:1}}).exec()
  },
  GetUserByToken:(token,callback)=>{
    UserModel.find({token:token}).exec((err,docs)=>{
      if(docs){
        callback(docs[0])
      }
    })
  },
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
        if(docs.length>0){
          //Пользователь найден
          if(docs[0].token){
            //Уже авторизован
            res.send({
              status:false,
              error:'Already auth'
            })
          }else{
            //Авторизуемся
            let token = GetToken()
            docs[0].updateOne({$set:{token:token}},(err,docs)=>{
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
          }
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
    if(data.login!=='' && data.pass!==''){
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
            newUser.save()
            res.send({
              status:true,
              token:token
            })
          }
        }
      })
    }
  },
  Logout:(req,res)=>{
    let token = req.body.token
    if(token){
      UserModel.updateOne({token:token},{$unset:{token:1}},(err,docs)=>{
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
  }
}
function GetToken() {
  return sha1(Math.random()*Math.random()*Math.random())
}
