import { defineComponent,ref, onMounted } from 'vue';
import {user} from '@/service'
import {result, formatTimeStamp} from "@/helpers/utils";
import {message} from "ant-design-vue";
import AddOne from './AddOne/index.vue'
import {getCharacterInfoById} from "@/helpers/character";

const columns = [
  {
    title: '账户',
    dataIndex: 'account',
  },
  {
    title:'创建日期',
    slots: {
      customRender: 'createdAt'
    }
  },
  {
    title:'角色',
    slots: {
      customRender: 'character'
    }
  },
  {
    title:'操作',
    slots: {
      customRender: 'actions'
    }
  },
]
export default defineComponent({
  components:{
    AddOne,
  },
  setup(){
    const list = ref([])
    const curPage = ref(1)
    const total = ref(0)
    const showAddModal = ref(false)

    const getUser = async () => {

      const res = await user.list(curPage.value,10)

      result(res)
        .success(({data : {list :refList, total : resTotal}}) => {
          list.value = refList;
          total.value = resTotal;
        })
    }

    onMounted(() => {

      getUser()
    })

    const remove = async ({_id}) => {
      const res = await user.remove(_id)

      result(res)
        .success(({msg}) =>{
          message.success(msg)
          getUser()
        })
    }

    const setPage = (page) => {
      console.log(page)
      curPage.value = page
      getUser()
    }

    return {
      list,
      total,
      curPage,
      columns,
      remove,
      formatTimeStamp,
      showAddModal,
      getUser,
      setPage,
      getCharacterInfoById
    }
  }
})
