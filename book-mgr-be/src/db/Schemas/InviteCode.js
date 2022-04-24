const mongoose = require('mongoose')
const {getMate} = require('./helper')
const InviteCodeSchema = new mongoose.Schema({
    //邀请码
    code:String,
    //用了注册哪个用户
    user:String,

    meta:getMate(),
})

mongoose.model('InviteCode', InviteCodeSchema)
