import axios from "axios";
export const addBorrow = (data) => {
  return axios.post('http://47.103.117.125/stu-mgr/add_user_borrow',
    data)
}
