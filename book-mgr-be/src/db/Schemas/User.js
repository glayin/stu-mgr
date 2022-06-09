const mongoose = require('mongoose')
const {getMate} = require('./helper')
const UserSchema = new mongoose.Schema({
    account: String,
    password:String,
    readerNo:String,
    character:String,
    name:String,
    address:String,
    company:String,
    meta:getMate(),
})

mongoose.model('User', UserSchema)
