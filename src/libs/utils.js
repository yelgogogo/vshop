import axios from 'axios'

let util = {}
// 8688
const ajaxUrl =
  process.env.NODE_ENV === 'development'
    ? window.g.baseUrl
    : process.env.NODE_ENV === 'production'
      ? window.g.baseUrl
      : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  withCredentials: false,
  timeout: 30000
})

export default util
