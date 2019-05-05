let mongoose = require('mongoose')
let Schema = mongoose.Schema
let UserSchema = new Schema({
  login: String,
  pass: String,
  token: String
})
let UserModel = mongoose.model('User', UserSchema )
module.exports = UserModel
