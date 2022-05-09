import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store'
import { user } from '@/service';
import { message } from 'ant-design-vue';
const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName:"auth" */ '../views/Auth/index.vue'),
  },
  {
    path: '/',
    name: 'BasicLayout',
    redirect: '/auth',
    component: () => import(/* webpackChunkName:"BasicLayout" */ '../layout/BasicLayout/index.vue'),
    children: [
      {
        path: 'books',
        name: 'Books',
        component: () => import(/* webpackChunkName:"Books" */ '../views/Books/index.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import(/* webpackChunkName:"Users" */ '../views/Users/index.vue'),
      },
      {
        path: 'Borrow',
        name: 'Borrow',
        component: () => import(/* webpackChunkName:"Borrows" */ '../views/Borrow/index.vue'),
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach( async (to, from, next)=>{
  //to我要去哪个页面，对象
  //from我从哪个页面来的，对象
  //next调用这个方法进入下一页，方法

  // if(!store.state.characterInfo.length){
  //   await store.dispatch('getCharacterInfo')
  //
  // }
  //
  // if(to.path ==='/auth'){
  //   next('/auth')
  //   return
  // }
  // if(!store.state.userInfo.account){
  //  await store.dispatch('getUserInfo')
  // }
  let res = {};

  try {
    res = await user.info();
  } catch (e) {
    if (e.message.includes('code 401')) {
      res.code = 401;
    }
  }

  const { code } = res;

  if (code === 401) {
    if (to.path === '/auth') {
      next();
      return;
    }

    message.error('认证失败，请重新登入');
    next('/auth');

    return;
  }



  const reqArr = [];
  if (!store.state.userInfo.account) {
    // await store.dispatch('getUserInfo')
    reqArr.push(store.dispatch('getUserInfo'));
  }

  if (!store.state.characterInfo.length) {
    // await store.dispatch('getCharacterInfo');
    reqArr.push(store.dispatch('getCharacterInfo'));
  }



    await Promise.all(reqArr);


  // console.log(to, from)
  next()
  }

)
export default router;
