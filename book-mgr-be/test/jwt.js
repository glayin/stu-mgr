var jwt = require('jsonwebtoken')
var token = jwt.sign({
    account: 'a.cc.com',
    _id:'123',
}, 'aaaa');

console.log(token)
//header 加密的参数

//payload
//加密后的结果


//signature
//密钥

jwt.verify(token, 'aaaa',(err,payload) => {
    console.log(err,payload)
})

