import axios from 'axios'

let util = {}
// 8688
const ajaxUrl = process.env.NODE_ENV === 'development' ? 'http://nstart.cc:8688' : process.env.NODE_ENV === 'production' ? 'http://nstart.cc:80' : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  withCredentials: true,
  timeout: 30000
})

export default util
