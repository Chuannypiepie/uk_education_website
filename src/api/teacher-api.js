import * as axios from './http.js';
import { RoleModel } from './model.js';
RoleModel;
/**
 * @description GET 导出老师信息
 * @host /admin/master-excel
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.teacherInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const masterExcel = function({
  teacherInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/master-excel',
    method: 'GET',
    data: {
      ...teacherInfo.toMap(),
      pageParameter: {
        pageNo,
        pageSize,
        searchWord,
        timeType,
        startTime,
        endTime,
      },
    },
  });
};

/**
 * @description GET 分页多条件查询 老师信息
 * @host /admin/auth/getPageMasterInfo
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.teacherInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const getPageMasterInfo = function({
  // teacherInfo,
  pageInfoName,
}) {
  return axios.http({
    url: '/admin/master/getPageMasterInfo',
    method: 'GET',
    data: {
      ...pageInfoName.toSpecialMap(),
      'pageParameter.timeType': pageInfoName.orderByTime ? '1' : '0',
      isDel: pageInfoName.isDel,
      // 'pageParameter.pageSize': '123',
      // ...teacherInfo.toMap(),
      // pageParameter: JSON.stringify({
      //   ...pageInfoName.toMap(),
      //   timeType: pageInfoName.orderByTime,
      // }),
    },
  });
};

/**
 * @description POST 后台添加老师
 * @host /admin/auth/addMaster
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.teacherInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const addMaster = function({
  teacherInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/master/addMaster',
    method: 'POST',
    data: {
      ...teacherInfo.toMap(),
      pageParameter: {
        pageNo,
        pageSize,
        searchWord,
        timeType,
        startTime,
        endTime,
      },
    },
  });
};

/**
 * @description DELETE 后台删除老师 假删除
 * @host /admin/auth/deleteMaster/{userId}
 * @param {int} userId - 用户id
 * */
export const deleteMaster = function({
  userId, }) {
  return axios.http({
    url: '/admin/master/deleteMaster/' + userId,
    method: 'DELETE',
  });
};

/**
 * @description POST 后台修改老师信息
 * @host /admin/auth/updateMaster
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.teacherInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const updateMaster = function({
  teacherInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/master/updateMaster',
    method: 'POST',
    data: {
      ...teacherInfo.toSpecialMap(),
      pageParameter: {
        pageNo,
        pageSize,
        searchWord,
        timeType,
        startTime,
        endTime,
      },
    },
  });
};

/**
 * @description POST 为老师添加权限（免审核） userId用户id 与 type类型（1：作业、2资料）
 * @host /admin/auth/setMasterRole
 * @param {Object} Option - 传入值
 * @param {int} Option.userId - userId用户id
 * @param {int} Option.type -  type类型（1：作业、2资料）
 * */
export const setMasterRole = function({
  userId,
  type,
}) {
  return axios.http({
    url: '/admin/auth/setMasterRole',
    method: 'POST',
    data: {
      userId,
      type,
    },
  });
};

