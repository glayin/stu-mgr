const Router = require('@koa/router')
const mongoose = require('mongoose')
const {getBody} = require('../../helpers/utils')

const BOOK_CONST = {
    IN : 'IN_COUNT',
    OUT : 'OUT_COUNT',
}
const Book = mongoose.model('Book')


const router = new Router({
    prefix: '/book'
})

router.post('/add', async (ctx) => {
    const {
        name,
        price,
        author,
        publishDate,
        classify,
        count,
    } = getBody(ctx)

    const book = new Book({
        name,
        price,
        author,
        publishDate,
        classify,
        count,
    })

    const res = await book.save()

    ctx.body = {
        data:res,
        code:1,
        msg:'添加成功'
    }

})

router.get('/list', async (ctx) => {

    const {
        page = 1,
        keyword = '',
    } = ctx.query

    let {
        size = 10
    } = ctx.query

    size = Number(size)
    //skip跳过多少条
    //limit查几条

    const query = {}


    if(keyword){
        query.name = keyword
    }

    const list = await Book
        .find(query)
        .skip((page - 1) * size)
        .limit(size)
        .exec()

    const total = await Book.countDocuments()

    ctx.body = {
        data:{
            total,
            list,
            page,
            size,
        },
        code:1,
        msg:'获取列表成功'
    }

    router.delete('/:id', async (ctx) => {
        const {
            id,
        } = ctx.params;

        const delMsg = await Book.deleteOne({
            _id: id,
        })

       ctx.body = {
            data:delMsg,
            msg:'删除成功',
            code:1,
       }
    })
})

router.post('/update/count' , async (ctx) => {
        const {
            id,
            type,

        } = ctx.request.body

        let {num,} = ctx.request.body
        num = Number(num)

        const book = await Book.findOne({
            _id : id,
        }).exec()

        if(!book){
            ctx.body = {
                code: 0,
                msg:'没有找到书籍'
            }

            return
        }

        if( type === BOOK_CONST.IN){
            //入库操作
            num = Math.abs(num)
        }else{
            //出库操作
            num = -Math.abs(num)
        }

        book.count = book.count + num

        if(book.count < 0) {
            ctx.body = {
                code:0,
                msg:'剩下的量不足以出库',
            }
            return;
        }

        const res = await book.save()

        ctx.body = {
            data: res,
            code:1,
            msg:'操作成功'
        }
    })

module.exports = router
