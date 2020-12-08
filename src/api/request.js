
import axios from 'axios'
import Nprogress from 'nprogress'

const request = axios.create({
  // baseURL: 'http://timemeetyou.com:8889/api/private/v1',
  // baseURL: 'http://api.ojbk666.top/api/private/v1/',
  baseURL: 'http://120.53.120.229:8888/api/private/v1',
  timeout: 5000 ,
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // withCredentials: true
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  Nprogress.start()
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
 
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  Nprogress.done()
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default request