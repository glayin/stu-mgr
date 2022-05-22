import {defineComponent ,ref, onMounted } from 'vue'
import store from '@/store';
import {borrowRecords } from '@/service'
import {result, formatTimeStamp} from "@/helpers/utils";
import {message, Modal, Input} from "ant-design-vue";


export default defineComponent({

  setup(){
    const columns = [
      {
        title:'书名',
        dataIndex:'book',
      },
      {
        title: '数量',
        dataIndex: 'number',
      },

      {
        title: '借/还日期',
        dataIndex: 'date',

      },
      {
        title: '状态',
        slots:{
          customRender: 'is_return'
        }
      },
      {
        title:'超期',
        slots:{
          customRender: 'is_overdue'
        }
      }


      //   {
      //     title: '操作',
      //     slots:{
      //     customRender: 'actions'
      // }
      //   }
    ];

    const show = ref(false)

    const curPage = ref(1)
    const keyword = ref('')
    const list = ref([])
    const total = ref(0)
    const user = store.state.userInfo.account
    const isSearch = ref(false)
    const getList =  async () => {

      const res = await borrowRecords.getRecords({
        user: user
      })

      console.log(res)
      const{data :l} = res.data
      list.value = l
      console.log(list.value)


    }

    onMounted(async () => {
      console.log(store.state.userInfo.account )
      getList()
    })

    const setPage = (page) => {
      console.log(page)
      // console.log(page,pagesize)
      curPage.value = page
      // getList()
    }

    const onSearch = () => {
      // getList();
      isSearch.value = keyword.value;
    }

    const backAll = () => {
      keyword.value = ''
      // getList()
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

    const updateCount = (type , record) => {
      let word = "还"

      if(type === 'OUT_COUNT'){
        word = "借"
      }

      Modal.confirm({
        title:`要${word}多少本书`,
        content: (
          <div>
            <Input class = "__book_input_count"/>
          </div>
        ),
        onOk : async () => {
          const el = document.querySelector('.__book_input_count')
          let num = el.value
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
