import axios from "axios";
export const getRecords = (data) => {
  return axios.get('http://47.103.117.125/stu-mgr/list_user_borrow',
    {params:data})
}
