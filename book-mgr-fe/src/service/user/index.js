import axios from "axios";

export const list = (page=1  , size = 20) => {
  return axios.get('http://localhost:3000/user/list',
    {
      params:{
        page,
        size,
      }
    }
    )
}

export const remove = (id) => {
  return axios.delete(`http://localhost:3000/user/${id}`)
}

export const add = (account, password,character) => {
  return axios.post('http://localhost:3000/user/add',{
    account,
    password,
    character
  })
}

export const info = () => {
  return axios.get('http://localhost:3000/user/info')
}
