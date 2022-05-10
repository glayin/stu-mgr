import{ defineComponent,reactive,ref } from 'vue';
import {UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons-vue'
import {auth} from '@/service';
import {result} from "@/helpers/utils";
import {getCharacterInfoById} from "@/helpers/character";
import {message} from "ant-design-vue";
import store from '@/store';
import {useRouter} from 'vue-router'
import {setToken} from "@/helpers/token";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    MailOutlined
  },
  setup(){

    const router = useRouter()

    const regForm = reactive({
      //注册表单数据
      account : '',
      password: '',
      inviteCode: '',
      name:'',
      address:'',
      company:''
    });

    const register = async () => {
      // 注册逻辑
      if(regForm.account === ''){
        message.info('请输入账户')
        return;
      }
      if(regForm.password === ''){
        message.info('请输入密码')
        return;
      }
      // if(regForm.inviteCode === ''){
      //   message.info('请输入邀请码')
      //   return;
      // }

      const res = await auth.register(
        regForm.account,
        regForm.password,
        regForm.inviteCode,
        )

      result(res)
        .success((data) => {
          message.success(data.msg)
        })
        // .fail(() =>{
        //   alert(1)
        // })

    }

    const loginForm = reactive({
      //登录表单逻辑
      account : '',
      password: '',
    })

    const  login = async() => {
      // 登录表单路径
      if(loginForm.account === ''){
        message.info('请输入账户')
        return;
      }
      if(loginForm.password === ''){
        message.info('请输入密码')
        return;
      }
      const res = await auth.login(loginForm.account, loginForm.password)

      result(res)
        .success(async ({msg, data : {user, token}}) => {
         message.success(msg)
          setToken(token)

          await store.dispatch('getCharacterInfo');

          store.commit('setUserInfo', user)
          store.commit('setUserCharacter',getCharacterInfoById(user.character))
          if(store.state.userCharacter.title ==="管理员" ){
            router.replace('/books')
          }else {
            router.replace('/borrow')
          }

        //  replace跳到下一页不能回退，repush可以
        })

      // const {data} = await auth.login(loginForm.account, loginForm.password)
      //
      // if(data.code) {
      //   message.success(data.msg)
      //   return
      // }
      //
      // message.error(data.msg)
    }
    return {
      //注册相关的数据
      regForm,
      register,
      //登录相关的数据
      login,
      loginForm
    }
  },
});
