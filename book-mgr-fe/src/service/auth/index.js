import axios from 'axios';

export const register = (account, password, inviteCode, character,address,name,company) => {
  return  axios.post("http://localhost:3000/auth/register", {
    account,
    password,
    inviteCode,
    character,
    address,
    name,
    company
  })
}

export const login = (account, password) => {
  return axios.post('http://localhost:3000/auth/login' ,{
    account,
      password,
  })
}
