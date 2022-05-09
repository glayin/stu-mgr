const TOKEN_STOREAGE_KEY = '_tt'

export const getToken = () => {

  return localStorage.getItem(TOKEN_STOREAGE_KEY) || '';
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_STOREAGE_KEY, token)
  return token
}
