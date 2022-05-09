const Router = require('@koa/router')
const mongoose = require('mongoose')
const {v4 : uuidv4} = require('uuid')
const {verify, getToken} =require('../../helpers/token')
const User = mongoose.model('User')
const Character = mongoose.model('Character')
const router = new Router({
    prefix: '/user',
})

router.get('/list', async (ctx) => {
    let {
        page,
        size
    } = ctx.query

    page = Number(page)
    size = Number(size)

    const list = await User
        .find()
        .sort({
            _id: -1,
        })
        .skip((page - 1) * size)
        .limit(size)
        .exec()

    const total = await User.countDocuments().exec()

    ctx.body = {
        msg:'获取列表成功',
        data : {
         list,
         page,
         size,
         total
        },
        code:1,
    }

});

router.delete('/:id', async (ctx) => {
    const {
        id,
    } = ctx.params;

    const delMsg = await User.deleteOne({
        _id: id,
    })


    ctx.body = {
        data:delMsg,
        code:1,
        msg:'删除成功'
    }

});

router.post('/add', async (ctx) => {
    const {
        account,
        password,
        character
    } = ctx.request.body;

    const char = Character.findOne({
        _id:character,
    })

    if(!char){
        ctx.body = {
            msg:'出错了',
            code:0,
        }
        return
    }
    const user = new User({
        account,
        password: password || '123123',
        character
    })

    const res = await user.save()

    ctx.body = {
        data:res,
        code:1,
        msg:'添加成功',
    }
})

router.get('/info', async (ctx) => {
    ctx.body = {
        data : await verify(getToken(ctx)),
        code : 1,
        msg:'获取成功',
    }
})


module.exports = router
