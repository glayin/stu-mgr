const mongoose = require('mongoose')
const {getMate} = require('./helper')
const CharacterSchema = new mongoose.Schema({
    // member , admin
    name:String,
    //成员 管理员
    title: String,
    power:Object,
    
    meta:getMate(),
})

mongoose.model('Character', CharacterSchema)
