const auth = require('./auth')
const inviteCode = require('./invite-code')
//app接收koa一个实例
module.exports = (app) => {
    app.use(auth.routes())
    app.use(inviteCode.routes())
}
