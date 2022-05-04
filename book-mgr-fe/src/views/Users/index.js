import { defineComponent,ref, onMounted } from 'vue';
import {user} from '@/service'
import {result, formatTimeStamp} from "@/helpers/utils";

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
    title:'操作',
    slots: {
      customRender: 'actions'
    }
  },
]
export default defineComponent({
  setup(){
    const list = ref([])
    const curPage = ref(1)
    const total = ref(0)
    const getUser = async () => {
      const res = await user.list(curPage.val,10)

      result(res)
        .success(({data : {list :resList, total : resTotal}}) => {
          list.value = resList;
          total.value = resTotal;
        })
    }

    onMounted(() => {
      getUser()
    })
    return {
      list,
      total,
      curPage,
      columns,
      formatTimeStamp
    }
  }
})
