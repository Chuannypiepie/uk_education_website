import * as axios from './http.js';
// 管理用户部分的api
/**
 * 获取用户菜单 '/admin/auth/getAdminCanUseMenu'
 * 方式Get
 */
export const getUsemenu = function() {
  return axios.http({ url: '/admin/auth/getAdminCanUseMenu', method: 'GET', });
};
/**
 * 后台登录
 * 方式post
 * /admin/auth/loginWithNameOrAccountAndPwd
 * @param {Object} Option - 传入值
 * @param {String} Option.account - 账号
 * @param {String} Option.password -  密码
 */
export const login = function({ account, password, }) {
  return axios.http({
    url: '/admin/auth/loginWithNameOrAccountAndPwd',
    method: 'POST',
    data: {
      account,
      password,
    },
  });
};
/**
 * 获取用户信息结构
 * 方式get
 * /admin/auth/getUserInfoStructure
 */
export const getUserInfoStructure = function() {
  return axios.http({
    url: '/admin/auth/getUserInfoStructure',
    method: 'GET',
  });
};
/**
 * 删除管理用户
 * 方式 DELETE
 * @path /admin/auth/deleteAdminUser/{adminUserId}
 * @param adminUserId - 管理用户id
 */
export const deleteAdminUser = function(adminUserId) {
  return axios.http({
    url: '/admin/auth/deleteAdminUser/' + adminUserId,
    method: 'DELETE',
  });
};
/**
 * @desc 修改后台用户 PUT
 * @host /admin/auth/updateAdminUser/{adminUserId}
 * @param {Object} option - 传入值
 * @param {String} option.adminUserId - 用户id
 * @param {String} option.userName - 用户名
 * @param {String} option.userAvatar - 用户头像
 * @param {String} option.loginPassword - 用户密码
 * @param {Array<String>} option.roleNames - 用户昵称
 * @returns {object} 返回值
 */
export const updateAdminUser = function({
  adminUserId,
  userName,
  userAvatar,
  loginPassword,
  roleNames,
}) {
  return axios.http({
    url: '/admin/auth/updateAdminUser/' + adminUserId,
    method: 'PUT',
    data: {
      userName,
      userAvatar,
      loginPassword,
      roleNames,
    },
  });
};

/**
 * @desc 后台用户列表 GET
 * @host /admin/auth/getAdminUserList
 * @param {Object} option - 传入值
 * @param {int} option.pageNo - 页码
 * @param {int} option.pageSize - 页长
 * @param {String} option.searchWord - 搜索关键词
 * @param {int} [option.isDel = 0]  - 是否删除的 默认0
 * @param {int} [option.orderByCreateTime = 0] - 时间排序 默认0
 * @returns {object} 返回值
 */
export const getAdminUserList = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/auth/getAdminUserList',
    method: 'GET',
    data: {
      ...pageParameter.toMap(),
    },
  });
};

/**
 * @desc 创建后台用户 POST
 * @host /admin/auth/createAdminUser
 * @param {Object} option - 传入值
 * @param {int} option.userName	 - 用户名
 * @param {int} option.password - 用户密码
 * @param {Array<String>} option.roleNames - 用户昵称
 * @returns {object} 返回值
 */
export const createAdminUser = function({
  userName,
  password,
  roleNames,
}) {
  return axios.http({
    url: '/admin/auth/createAdminUser',
    method: 'POST',
    data: {
      userName,
      password,
      roleNames,
    },
  });
};

/**
 * @desc 获取用户操作日志 POST
 * @host /admin/auth/getAdminOperationRecord
 * @param {Object} option - 传入值
 * @param {int} option.pageNo	 - 页码
 * @param {int} option.pageSize - 页面大小
 * @param {int} option.searchWord - 关键词
 * @param {int} [option.createTimeOrder] - 时间排序 默认0
 * @returns {object} 返回值
 */
export const getAdminOperationRecord = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/auth/getAdminOperationRecord',
    method: 'GET',
    data: {
      ...pageParameter.toMap(),
    },
  });
};

