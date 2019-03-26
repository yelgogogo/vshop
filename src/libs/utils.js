import axios from 'axios'

let util = {}
// 8688
const ajaxUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:81/' : process.env.NODE_ENV === 'production' ? 'http://120.25.86.111:89/' : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  withCredentials: true,
  timeout: 30000
})

export default util
