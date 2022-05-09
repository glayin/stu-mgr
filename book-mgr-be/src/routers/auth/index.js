const Router = require('@koa/router')
const mongoose = require('mongoose')
const {getBody} = require('../../helpers/utils')
const {v4 : uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const config = require('../../project.config')
const router = new Router({
    prefix: '/auth',
})

const User = mongoose.model('User')
const InviteCode = mongoose.model('InviteCode')

router.post('/register', async (ctx) => {

    const {account,
           password,
           inviteCode} = getBody(ctx)
    //做表单校验
    //邀请码删掉了
    if(account === '' ||password === '' ){
        ctx.body = {
            code : 0,
            msg :'字段不能为空',
            data:null,
        }
        return
    }
    //找有没有邀请码
    // const findCode = await InviteCode.findOne({
    //     code:inviteCode
    // }).exec()
    // if((!findCode) || findCode.user){
    //     ctx.body = {
    //         code : 0,
    //         msg :'邀请码不正确',
    //         data:null,
    //     }
    //     return
    // }
    //去找account为传递上来的“account”用户
    const findUser = await User.findOne({
        account,
    }).exec()
    //判断有没有用户，如果有表示已经存在
    if(findUser){
        ctx.body = {
            code : 0,
            msg :'已存在该用户',
            data:null,
        }
        return
    }
    //创建一个用户

    const user = new User({
        account,
        password,
        readerNo:uuidv4()
    })
    //把创建的用户同步到mongodb
    const res = await user.save()

    // findCode.user = res._id
    // findCode.meta.updatedAt = new Date().getTime()
    // await findCode.save()
    //相应成功
    ctx.body = {
        code : 1,
        msg: `注册成功,您的读者号${user.readerNo}`,
        data: res,
    }
})

router.post('/login', async (ctx) => {
    const {account,
           password,

            } = getBody(ctx)

    if(account === '' ||password === ''){
        ctx.body = {
            code : 0,
            msg :'字段不能为空',
            data:null,
        }
        return
    }
    const one = await User.findOne({
        account,
    }).exec()

    if(!one){
        ctx.body = {
            code:0,
            msg:'用户名或密码错误',
            data:null,
        }
        return

    }

    const user = {
        account: one.account,
        character:one.character,
        _id: one._id,
    };
    if(one.password === password){
        ctx.body={
            code:1,
            msg:'登录成功',
            data:{
                user,
                token: jwt.sign(user, config.JWT_SECRET),

            },

        };
        return
    }
    ctx.body = {
        code:0,
        msg:'用户名或密码错误',
        data:null,
    }


})
module.exports = router
