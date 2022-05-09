const auth = require('./auth')
const inviteCode = require('./invite-code')
const book = require('./book')
const user = require('./user')
const character = require('./character')
//app接收koa一个实例
module.exports = (app) => {
    app.use(auth.routes())
    app.use(inviteCode.routes())
    app.use(book.routes())
    app.use(user.routes())
    app.use(character.routes())
}
