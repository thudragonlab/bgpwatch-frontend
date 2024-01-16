import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
// import { getToken } from '@/utils/auth'
// import { API_BASE_URL } from '@/utils/url_config'

// create an axios instance
let oldCrrentView = localStorage.getItem('currentView')
const service = axios.create({
  // baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 * 2
  // * 20, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(config)
    if (config.useToken) {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const token = JSON.parse(userInfo).token
        // console.log(JSON.parse(userInfo).token)
        // config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        config.headers['Authorization'] = 'Bearer ' + token
      }
    }

    return config
  },
  // error => {
  //   // do something with request error
  //   console.log(error) // for debug
  //   return Promise.reject(error)
  // }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const {
      data,
      headers
    } = response
    if (headers['content-type'] === "text/csv; charset=utf-8") {
      const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
      console.log(fileName)
      // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
    } else {
      const data = response.data
      if(data.lastUpdateTimeStamp && data.lastUpdateTimeStamp > 0){
        const lastUpdateTimeStamp = data.lastUpdateTimeStamp
        const nowCrrentView = localStorage.getItem('currentView')
        if(oldCrrentView !== nowCrrentView){
          localStorage.setItem('lastUpdateTimestamp',lastUpdateTimeStamp)
          oldCrrentView = nowCrrentView
        }else{
          const oldLastUpdateTimestamp = localStorage.getItem('lastUpdateTimestamp')
          if(!oldLastUpdateTimestamp){
            localStorage.setItem('lastUpdateTimestamp',lastUpdateTimeStamp)  
          }else{
            const newUpdateTimestamp = Math.max(Number(lastUpdateTimeStamp),Number(oldLastUpdateTimestamp))
            localStorage.setItem('lastUpdateTimestamp',newUpdateTimestamp)
          }
        }
        
      }
      
      if (!data.status) {
        MessageBox({
          message: data.statusCode || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(data)
      }
    }
    return data.data
   
  },
  error => {
    console.error(error.message) // for debug
    if (error.message && error.message.includes('aborted')) {
      return Promise.reject(error)
    }

    MessageBox({
      message: 'No data found.',
      type: 'error',
      duration: 1 * 1000
    })
    return Promise.reject(error)
  }
)

export default service