import * as axios from './http.js';
import { RoleItem } from './model.js';
RoleItem;
/**
 * @description PUT 修改角色
 * @host /admin/auth/updateRole/{roleId}
 * @param {Object} Option - 传入值
 * @param {int} Option.roleId - 角色id
 * @param {String} Option.roleAlias - 角色昵称
 * @param {String} Option.description - 角色描述
 * @param {Array<String>} Option.permissionNames - 权限列表
 * */
export const updateRole = function({
  roleId,
  roleAlias,
  description,
  permissionNames,
}) {
  console.log({
    roleId,
    roleAlias,
    description,
    permissionNames,
  });
  return axios.http({
    url: '/admin/auth/updateRole/' + roleId,
    method: 'PUT',
    data: {
      roleAlias,
      description,
      permissionNames,
    },
  });
};

/**
 * @description POST 创建角色
 * @host /admin/auth/createRole
 * @param {Object} Option - 传入值
 * @param {String} Option.roleName - 角色名称
 * @param {String} Option.roleAlias - 角色别名
 * @param {Array<String>} Option.permissionNames - 权限名称
 * @param {String} Option.description - 描述
 * */
export const createRole = function({
  roleName,
  roleAlias,
  permissionNames,
  description,
}) {
  return axios.http({
    url: '/admin/auth/createRole',
    method: 'POST',
    data: {
      roleName,
      roleAlias,
      permissionNames,
      description,
    },
  });
};

/**
 * @description GET 角色列表
 * @host /admin/auth/getRoleList
 * @param {Object} Option - 传入值
 * @param {Number} Option.pageNo - 页码
 * @param {Number} Option.pageSize - 页面大小
 * @param {String} Option.searchWord - 搜索词
 * @param {Number} Option.orderByTime - 时间排序 0 1
 * */
export const getRoleList = function({
  pageNo,
  pageSize,
  searchWord,
  orderByTime,
}) {
  return axios.http({
    url: '/admin/auth/getRoleList',
    method: 'GET',
    data: {
      pageNo,
      pageSize,
      searchWord,
      orderByTime,
    },
  });
};

/**
 * @description DELETE 删除角色
 * @host //admin/auth/deleteRole/{roleId}
 * @param {Object} Option - 传入值
 * @param {int} Option.roleId - 角色id
 * */
export const deleteRole = function({
  roleId,
}) {
  return axios.http({
    url: '/admin/auth/deleteRole/' + roleId,
    method: 'DELETE',
  });
};

/**
 * @description GET 角色详细
 * @host /admin/auth/roleInfo/{roleId}
 * @param {Object} Option - 传入值
 * @param {int} Option.roleId - 角色id
 * */
export const roleInfo = function({
  roleId,
}) {
  return axios.http({
    url: '/admin/auth/roleInfo/' + roleId,
    method: 'GET',
  });
};
