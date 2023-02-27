import Axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
// const baseIp = 'http://localhost:8080/';
// const baseIp = 'http://ukedunet.pkl.cc:18080';
const baseIp = 'http://ukedunet.test.jobs123.cn';
// const baseIp = 'http://192.168.110.129:9567';
export const CONTENT_TYPE = 'Content-Type';

export const FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=UTF-8';

export const APPLICATION_JSON = 'application/json; charset=UTF-8';

export const TEXT_PLAIN = 'text/plain; charset=UTF-8';

const service = Axios.create({
  baseURL: baseIp,
  timeout: 10 * 60 * 1000,
  withCredentials: true, // 跨域请求时发送cookie
});

service.interceptors.request.use(
  config => {
    !config.headers && (config.headers = {});
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = APPLICATION_JSON;
    }
    if (config.headers[CONTENT_TYPE] === FORM_URLENCODED) {
      config.data = qs.stringify(config.data);
    }
    /**
     * @constant {?String} - 这个是token可能为null
     *  */
    const token = Cookies.get('admin-token');
    console.log('这是一个token', token);
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error.response);
  }
);

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.status);
    }
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }
    return Promise.reject({ code: 500, msg: '服务器异常，请稍后重试…', });
  }
);

export default service;
