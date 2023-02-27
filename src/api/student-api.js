import * as axios from './http.js';
import { RoleModel } from './model.js';
RoleModel;
/**
 * @description GET 导出学生信息
 * @host /admin/student-excel
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.studentInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const studentExcel = function({
  studentInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/student-excel',
    method: 'GET',
    data: {
      ...studentInfo.toMap(),

      'pageParameter.pageNo': pageNo,
      'pageParameter.pageSize': pageSize,
      'pageParameter.searchWord': searchWord,
      'pageParameter.timeType': timeType,
      'pageParameter.startTime': startTime,
      'pageParameter.endTime': endTime,

    },
  });
};

/**
 * @description GET 分页多条件查询 学生信息
 * @host /admin/auth/getPageStudentInfo
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.studentInfo - 学生信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const getPageStudentInfo = function({
  // studentInfo,
  pageInfoName,
}) {
  return axios.http({
    url: '/admin/student/getPageStudentInfo',
    method: 'GET',
    data: {
      // ...studentInfo.toMap(),
      ...pageInfoName.toSpecialMap(),
      'pageParameter.timeType': pageInfoName.orderByTime ? '1' : '0',
      isDel: pageInfoName.isDel,
      // pageParameter: {
      // pageNo,
      // pageSize,
      // searchWord,
      // timeType,
      // startTime,
      // endTime,
      // },
    },
  });
};

/**
 * @description POST 后台添加学生
 * @host /admin/auth/addStudent
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.studentInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const addStudent = function({
  studentInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/student/addStudent',
    method: 'POST',
    data: {
      ...studentInfo.toMap(),
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
 * @description DELETE 后台删除学生 假删除
 * @host /admin/auth/deleteStudents/{userId}
 * @param {int} userId - 用户id
 * */
export const deleteStudents = function({
  userId, }) {
  return axios.http({
    url: '/admin/student/deleteStudents/' + userId,
    method: 'DELETE',
  });
};

/**
 * @description POST 后台修改学生信息
 * @host /admin/auth/updateStudents
 * @param {Object} Option - 传入值
 * @param {RoleModel} Option.studentInfo - 老师信息类
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const updateStudents = function({
  studentInfo,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime, }) {
  return axios.http({
    url: '/admin/student/updateStudents',
    method: 'POST',
    data: {
      ...studentInfo.toSpecialMap(),
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
 * @description POST 为学生添加权限（免审核） userId用户id 与 type类型（1：作业、2资料）
 * @host /admin/auth/setStudentRole
 * @param {Object} Option - 传入值
 * @param {int} Option.userId - userId用户id
 * @param {int} Option.type -  type类型（1：作业、2资料）
 * */
export const setStudentRole = function({
  userId,
  type,
}) {
  return axios.http({
    url: '/admin/auth/setStudentRole',
    method: 'POST',
    data: {
      userId,
      type,
    },
  });
};

const A = {
  'id': 16,
  'userEmail': 'nahainarenNLing@163.com',
  'userPhone': null,
  'userAvatar': '',
  'loginPassword': 'e10adc3949ba59abbe56e057f20f883e',
  'roleNames': null,
  'isDel': 0,
  'createTime': 1666331089,
  'updateTime': 0,
  'deleteTime': 0,
  'enabled': false,
  'authorities': null,
  'accountNonLocked': false,
  'accountNonExpired': false,
  'credentialsNonExpired': false,
  'username': 'ky',
  'password': null,
};
A;
