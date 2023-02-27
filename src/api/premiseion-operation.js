import * as axios from './http.js';
import { PermissioModel } from './model.js';
PermissioModel;
/**
 * @desc DELETE 删除权限
 * @host /admin/auth/deletePermission/{permissionId}
 * @param {Object} option - 传入值
 * @param {int} option.permissionId	 - 权限id名
 * @returns {object} 返回值
 */
export const deletePermission = function({
  permissionId,
}) {
  return axios.http({
    url: '/admin/auth/deletePermission/' + permissionId,
    method: 'DELETE',
    data: {
      permissionId,
    },
  });
};

/**
 * @desc GET 获取权限列表
 * @host /admin/auth/getPermissionList
 * @returns {object} 返回值
 */
export const getPermissionList = function() {
  return axios.http({
    url: '/admin/auth/getPermissionList',
    method: 'GET',
  });
};

/**
 * @desc PUT 修改权限
 * @host /admin/auth/updatePermission/
 * @param {Object} option - 传入值
 * @param {int} option.permissionId	 - 权限id名
 * @param {PermissioModel} option.permissioModel	- 权限类
 * @returns {object} 返回值
 */
export const updatePermission = function({
  permissionId,
  permissioModel,
}) {
  return axios.http({
    url: '/admin/auth/updatePermission/' + permissionId,
    method: 'PUT',
    data: {
      ...permissioModel.toSpecialMap(),
    },
  });
};
/**
 * @desc POST 添加权限列表
 * @host /admin/auth/createPermission
 * @returns {object} 返回值
 */
export const createPermission = function({
  permissioModel,
}) {
  return axios.http({
    url: '/admin/auth/createPermission',
    method: 'POST',
    data: {
      ...permissioModel.toMap(),
    },
  });
};

