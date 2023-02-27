import * as axios from './http.js';

/**
 * @function
 * @description 分页多条件获取文件列表
 * @host /admin/file/getDataAll
 * @param {Object} object - 传入值
 * @param {PageParameter} pageParameter - 页码类
 * @param {int} pageParameter.pageNo - 页数
 * @param {int} pageParameter.pageSize - 每页获取数量
 * @param {String} pageParameter.searchWord - 搜索内容
 * @param {int} pageParameter.timeType - 时间排序
 * @param {int} pageParameter.startTime - 按创建时间范围搜索--开始时间
 * @param {int} pageParameter.endTime - 按创建时间范围搜索--结束时间
 * */
export const getPageFilesList = function ({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/file/getDataAll',
    method: 'GET',
    data: {
      ...pageParameter.toSpecialMap([ 'timeType', ]),
    },
  });
};

/**
 * @function
 * @description 上传文件
 * @host /admin/upload-file
 * @method POST
 * @param {String} purpose - 描述用途
 * @param {File} file - 文件流
 */
export const uploadFile = function ({
  purpose,
  file,
}) {
  return axios.http({
    url: '/admin/upload-file',
    method: 'POST',
    data: {
      purpose,
      file,
    },
  });
};

/**
 * @function
 * @description 读取文件
 * @host /admin/read-file/{fileNum}
 * @method GET
 * @param {Number} fileNum - 文件编号
 */
export const readFile = function ({
  fileNum,
}) {
  return axios.http({
    url: `/admin/read-file/${fileNum}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      'responseType': 'blob',
    },
    method: 'GET',
  });
};

/**
 * @function
 * @description 删除文件
 * @host /admin/remove-file/{fileNum}
 * @method DELETE
 * @param {Number} fileNum - 文件编号
 */
export const deleteFile = function ({
  fileId,
}) {
  return axios.http({
    url: '/admin/remove-file',
    data: [ fileId, ],
    method: 'DELETE',
  });
};
