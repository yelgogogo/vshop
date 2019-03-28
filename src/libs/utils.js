import axios from 'axios'

let util = {}
// 8688
const ajaxUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://192.168.1.51:99/'
    : process.env.NODE_ENV === 'production'
      ? 'http://192.168.1.51:99/'
      : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  withCredentials: true,
  timeout: 30000
})

export default util
