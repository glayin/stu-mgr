const mongoose = require('mongoose')
const {getMate} = require('./helper')
const UserSchema = new mongoose.Schema({
    account: String,
    password:String,
    readerNo:String,
    character:String,
    meta:getMate(),
})

mongoose.model('User', UserSchema)
