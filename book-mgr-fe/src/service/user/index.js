import axios from "axios";

export const list = (page = 1, size = 20) => {
  return axios.get('http://localhost:3000/user/list',
    {
      params:{
        page,
        size,
      }
    }
    )
}
