import {ref,defineComponent,onMounted} from 'vue'
import menu from '@/config/menu'
import {useRouter, useRoute} from 'vue-router'
import store from '@/store'
export default defineComponent({
  setup(){
    const router = useRouter()
    const route = useRoute()
    const openKeys = ref([])
    const selectedKeys = ref([])

    onMounted(() => {
      selectedKeys.value = [route.path]
      if(store.state.userCharacter.name !=='admin'){
        menu.splice(1,1)
      }

    })
    const to = (url) => {
      router.push(url)
    }
    return{
      openKeys,
      selectedKeys,
      menu,
      to,

    }
  }



})
