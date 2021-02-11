/**
 * 封装axios请求模块
 */
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/' // 基础地址
    // baseURL: 'http://toutiao-app.itheima.net/' // 备用接口基础地址
})

export default request
