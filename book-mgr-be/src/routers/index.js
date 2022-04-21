const auth = require('./auth/index')
//app接收koa一个实例
module.exports = (app) => {
    app.use(auth.routes())
}
