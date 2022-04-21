const Koa = require('koa')
const koaBody = require('koa-body')
const {connect} = require('./db')
const registerRoutes = require('./routers')
const cors = require('@koa/cors')

const app = new Koa()
connect().then(() => {
    app.use(cors())
    app.use(koaBody())
    //koaBody处理请求体
    registerRoutes(app)


    app.listen(3000, () => {
        console.log('启动成功')
    })

})

//
// const authRouter = new Router({
//     prefix: '/auth'
// });
//
// authRouter.get('/register', async (ctx) => {
//     ctx.body = '注册成功'
// })
//
// const bookRouter = new Router({
//     prefix:'/book'
// })
//
// bookRouter.get('/add', async (ctx)=> {
//     ctx.body = '添加成功'
// })
// app.use(authRouter.routes())
// app.use(bookRouter.routes())


//通过app.use注册中间件
//中间件本质上是一个函数
//context上下文-当前请求的信息都在里面
// app.use((context)=>{
//     const {request : req } = context
//     const {url} = req
//
//     if(url === '/user'){
//         context.body = 'abcde'
//         return
//     }
//
//     context.body = '??'
// })
//
// const utils = require('./helpers/utils/index')
//
// console.log(utils)

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

console.log('112233')
