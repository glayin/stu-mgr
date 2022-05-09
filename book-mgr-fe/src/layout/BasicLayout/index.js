import {defineComponent} from 'vue'
import Nav from './Nav/index.vue'
import { setToken } from '@/helpers/token';
import store from '@/store';
export default defineComponent({
  components:{
    AppNav: Nav
  },
  setup() {

    const logout = () => {


      window.location.href = '/';
    };

    return {
      logout,
      store: store.state,
    };
  },

})
