const Koa = require('koa')

const app = new Koa()
//通过app.use注册中间件
//中间件本质上是一个函数
//context上下文-当前请求的信息都在里面
app.use((context)=>{
    const {request : req } = context
    const {url} = req

    if(url === '/user'){
        context.body = 'abcde'
        return
    }

    context.body = '??'
})

const utils = require('./helpers/utils/index')

console.log(utils)

// app.use((ctx) => {
//     const {path = '/'} = ctx
//
//     if(path === '/user/123'){
//         ctx.body = '返回用户123的信息'
//     }
//     if(path === '/settings'){
//         ctx.body = "返回一些设置的信息"
//     }
// })

//开启一个http服务
//接收http请求并作处理，处理完后响应
//默认端口http80 ， https 443
app.listen(3000, () => {
    console.log('启动成功')
})

console.log('112233')
