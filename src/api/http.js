import Vue from 'vue';
import request from './axios.config';

/**
 * 请求接口函数
 * @date 2022-12-17
 * @param {Object} obj 参数对象
 * @param {String} obj.url 接口地址
 * @param {Object} data 接口参数
 * @param {String} method='GET' 请求方式
 * @param {Object} headers 请求头参数
 * @param {Function} beforeRequest 发生请求前的钩子函数
 * @param {any} afterRequest 请求失败后的钩子函数
 * @returns {Object} 接口数据
 */
const http = function({ url, data, method = 'GET', headers, beforeRequest, afterRequest, }) {
  const successHandler = res => {
    if (res.code === 200 || headers && headers.responseType === 'blob') {
      return res;
    }
    console.log('请求失败，未知异常', url, data, res);
    throw new Error(res.message || '请求失败，未知异常');
  };
  const failHandler = error => {
    afterRequest && afterRequest();
    console.log('请求失败，未知异常', url, data, error);
    throw new Error(error.message || '请求失败，未知异常');
  };
  beforeRequest && beforeRequest();
  switch (method) {
    case 'GET':
    case 'get':
      return request.get(url, { params: data, ...headers, }).then(successHandler, failHandler);
    case 'POST':
    case 'post':
      return request.post(url, data, { headers, }).then(successHandler, failHandler);
    case 'DELETE':
    case 'delete':
      // return request.delete(url, {data, headers, }).then(successHandler, failHandler);
      /* 后端把接口所有的 delete 类型改成 post 类型了 */
      return request.post(url, data, { headers, }).then(successHandler, failHandler);
    case 'PUT':
    case 'put':
      return request.put(url, data, { headers, }).then(successHandler, failHandler);
    default:
      break;
  }
};
Vue.prototype.$http = http;
// get方法
function get({ url, data, beforeRequest = null, afterRequest = null, }) {
  return this.$http({ url, method: 'GET', data, beforeRequest, afterRequest, });
}
Vue.prototype.$get = get;

// post方法
function post({ url, data, headers, beforeRequest = null, afterRequest = null, }) {
  console.log(url, data, headers, beforeRequest, afterRequest);
  return this.$http({ url, method: 'POST', data, headers, beforeRequest, afterRequest, });
}
Vue.prototype.$post = post;

export { http };
