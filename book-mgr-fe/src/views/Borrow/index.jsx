import {defineComponent, ref, onMounted, reactive} from 'vue'
import store from '@/store'
import {book,borrow,borrowRecords } from '@/service'
import {result, formatTimeStamp, clone} from "@/helpers/utils";
import {getMyTime} from "@/helpers/getTIme";
import {message, Modal, Input} from "ant-design-vue";
const defaultFormData = {
  user:'',
  name: '',
  price:0,
  author:'',
  publishDate:0,
  classify:'',
  count:'',
}

export default defineComponent({

  setup(){
    const columns = [
      {
        title:'名字',
        dataIndex:'name',
      },
      {
        title: '作者',
        dataIndex: 'author',
      },
      {
        title: '库存',
        slots:{
          customRender: 'count'
        }
      },
      {
        title: '出版日期',
        dataIndex: 'publishDate',
        slots:{
          customRender: 'publishDate'
        }
      },
      {
        title: '价格',
        dataIndex: 'price',
      },

      {
        title: '分类',
        dataIndex: 'classify',
      },
    //   {
    //     title: '操作',
    //     slots:{
    //     customRender: 'actions'
    // }
    //   }
    ];

    const show = ref(false)
    const borrowForm = reactive(clone(defaultFormData));
    const curPage = ref(1)
    const keyword = ref('')
    const list = ref([])
    const total = ref(0)

    const isSearch = ref(false)
    const getList =  async () => {

      const res = await book.list({
        page:curPage.value,
        size:10,
        keyword:keyword.value,
      })

      result(res)
        .success(({data}) => {
          //对data解构
          const {list :l, total:t} = data
          list.value = l
          total.value = t

        })
    }

    onMounted(async () => {
        getList()
    })

    const setPage = (page) => {
      console.log(page)
      // console.log(page,pagesize)
        curPage.value = page
        getList()
    }

    const onSearch = () => {
      getList();
      isSearch.value = keyword.value;
    }

    const backAll = () => {
      keyword.value = ''
      getList()
      isSearch.value = false
    }
    //删除一本书籍
    const remove = async ({text : record}) => {

      const { _id } = record;

      const res = await book.remove(_id);

      result(res)
        .success(({msg}) => {
            message.success(msg)
            //findIndex 遍历
            const idx = list.value.findIndex((item) => {
              if(item._id === _id ){
                return true
              }
              //return item._id === _id
              return false
            })
            list.value.splice(idx,1)

        })
      // getList()
    }

    const updateCount =async (type , record) => {
      const user = store.state.userInfo.account
      const resOverdue =await borrowRecords.getRecords({
        user: user
      })
      const{data} = resOverdue.data
      console.log(data)
      if(data){
        let is_overdue = false
        data.forEach((item) => {
          if(item.is_overdue === true){
            is_overdue = true
          }
        })

        if(is_overdue) {
          message.error('您的借阅已超期，请联系管理员')
          return
        }
      }



      let word = "还"
      let is_return = true
      if(type === 'OUT_COUNT'){
        word = "借",
        is_return = false

      }



      Modal.confirm({
        title:`要${word}多少本书`,
        content: (
          <div>

            <Input class = "__book_input_count"/>
            <div>书名:{record.name}</div>
            <div>用户: {store.state.userInfo.account}</div>
            <div>日期:{getMyTime()}</div>
            <div>分类:{record.classify}</div>
          </div>

        ),
        onOk : async () => {
          const el = document.querySelector('.__book_input_count')
          let num = el.value
          if(num > 5){message.error('最多借5本')
            return
          }
          console.log(record.name)
          const res = await book.updateCount({
            id : record._id,
            num,
            type,
            })

          result(res).
            success((data) => {

            if( type === type){
              //入库操作
              num = Math.abs(num)
            }else{
              //出库操作
              num = -Math.abs(num)
            }

              const one = list.value.find((item) => {
                return item._id === record._id
              })

              if(one){
                one.count = one.count + num
                message.success(`成功${word} ${Math.abs(num)}本书`)
              }
          })

          const borrowRes = await borrow.addBorrow(
            {
              user: store.state.userInfo.account,
              book: record.name,
              date: getMyTime(),
              number:num,
              is_return: is_return
            }
          )


          getList()
        }
      })
    }
    return {
      columns,
      formatTimeStamp,
      show,
      list,
      curPage,
      setPage,
      onSearch,
      total,
      keyword,
      backAll,
      isSearch,
      remove,
      updateCount,
    }
  }
})
