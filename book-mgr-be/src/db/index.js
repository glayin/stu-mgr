require('./Schemas/User')
require('./Schemas/InviteCode')
require('./Schemas/Book')
require('./Schemas/Character')
const mongoose = require('mongoose')

//哪个数据库
//哪个集合
//添加什么格式的文档

//Schema映射了MongoDB下的一个集合，并且它的内容就是集合下的文档
//Modal可以理解成根据Schema生成的一套方法，这套方法用来操作MongoDB下的集合和集合下的文档

// const UserSchema = new mongoose.Schema({
//     nickname: String,
//     password: String,
//     age: Number
// })
//
// const UserModal = mongoose.model('User', UserSchema)

const  connect = () => {
    return new Promise((resolve) => {
        //连接数据库
        mongoose.connect('mongodb://1.117.67.66:27017/book-mgr')
        //数据库打开时做一些事情
        mongoose.connection.on('open', () => {
            console.log('连接数据库成功')
            resolve()

            // const user = new UserModal({
            //     nickname:'小明',
            //     password: '123456',
            //     age:12
            // })
            // user.save()
        })
        })




}



module.exports = {
    connect,
}
