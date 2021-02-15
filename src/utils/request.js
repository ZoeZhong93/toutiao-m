/**
 * 封装axios请求模块
 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 基础地址
  // baseURL: 'http://toutiao-app.itheima.net/' // 备用接口基础地址
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求发起会经过这里
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里务必要返回config配置对象，否则请求就停在这里出不去了
  return config
}, err => {
  // 请求出错了（还没有发出去）会进入这里
  return Promise.reject(err)
})

export default request
