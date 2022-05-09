const defaultCharacters = [
    {
        title:'管理员',
        name:"admin",
        power:{
            book: [0],
            user:[0],
        }
    },
    {
        title:'成员',
        name:"member",
        power:{
            book:[1],
            user:[-1],
        }
    }
]

module.exports = {
    defaultCharacters
}
