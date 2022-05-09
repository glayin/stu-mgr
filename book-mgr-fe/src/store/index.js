import { createStore ,Store} from 'vuex';
import {character, user} from '@/service'
import {getCharacterInfoById} from '@/helpers/character'
import {result} from "@/helpers/utils";

export default createStore({
  state: {
    characterInfo : [],
    userInfo:{},
    userCharacter:{}
  },
  getters: {
    setCharacterInfo(state, characterInfo){
      state.characterInfo = characterInfo
    }
  },
  mutations: {
    //直接设置数据
    setCharacterInfo(state, characterInfo){
      state.characterInfo = characterInfo
    },
    setUserInfo(state, userInfo){
      state.userInfo = userInfo
    },
    setUserCharacter(state, userCharacter){
      state.userCharacter = userCharacter
    }
  },
  actions: {
    //一系列操作设置数据
    async getCharacterInfo(store){
      const res = await character.list()

      result(res)
        .success(({data}) => {

          store.commit('setCharacterInfo', data)
        //  mutations
        })

    },
    async getUserInfo(store){
      const res = await user.info()

      result(res)
        .success(
          ({data}) => {
            console.log(data)
            store.commit('setUserInfo',data)

            store.commit('setUserCharacter', getCharacterInfoById(data.character))

            console.log(store)
          })

    }

  },

});

