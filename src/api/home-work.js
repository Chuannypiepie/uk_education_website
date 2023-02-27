import * as axios from './http.js';
import { HomeWorkModel } from './model.js';
HomeWorkModel;
/**
 * @function
 * @description 分页多条件获取作业记录
 * @host /admin/auth/getPageHomeworkInfo
 * @param {Object} object - 传入值
 * @param {HomeWorkModel} object.homeWork - 作业类
 * @param {int} object.pageNo
 * @param {int} object.pageSize
 * @param {String} object.searchWord
 * @param {int} object.timeType
 * @param {int} object.startTime
 * @param {int} object.endTime
 * */
export const getPageHomeworkInfo = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/homework/getPageHomeworkInfo',
    method: 'GET',
    data: {
      ...pageParameter.toSpecialMap([ 'timeType', ]),
    },
  });
};

/**
 * @function
 * @description 分页多条件获取 作业审核记录
 * @host /admin/auth/getPageEtHomeworkCheck
 * @param {Object} object - 传入值
 * @param {HomeWorkModel} object.homeWork - 作业类
 * @param {int} object.pageNo
 * @param {int} object.pageSize
 * @param {String} object.searchWord
 * @param {int} object.timeType
 * @param {int} object.startTime
 * @param {int} object.endTime
 * */
export const getPageEtHomeworkCheck = function({
  homeWork,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime,
}) {
  return axios.http({
    url: '/admin/auth/getPageEtHomeworkCheck',
    method: 'GET',
    data: {
      ...homeWork.toMap(),
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
 * @function
 * @description 审批作业
 * @host /admin/auth/approvalHomeworkCheck
 * @param {Object} object - 传入值
 * @param {HomeWorkModel} object.homeWork - 作业类
 * @param {int} object.pageNo
 * @param {int} object.pageSize
 * @param {String} object.searchWord
 * @param {int} object.timeType
 * @param {int} object.startTime
 * @param {int} object.endTime
 * */
export const approvalHomeworkCheck = function({
  homeworkCheckId,
  status,
  // 不通过原因
  refuseReason,
}) {
  return axios.http({
    url: '/admin/homework/approvalHomeworkCheck',
    method: 'POST',
    data: {
      homeworkCheckId,
      status,
      // 不通过原因
      refuseReason,
    },
  });
};

/**
 * @function
 * @description 获取审批作业记录详细
 * @host /admin/auth/getEtHomeworkInfoCheck/{hId}
 * @param {int} hId 不知道什么id
 * */
export const getEtHomeworkInfoCheck = function(hId) {
  return axios.http({
    url: '/admin/auth/getEtHomeworkInfoCheck/' + hId,
    method: 'GET',
  });
};

/**
 * @function
 * @description 获取作业记录详细
 * @host /admin/auth/getEtHomeworkInfo/{hId}
 * @param {int} hId 不知道什么id
 * */
export const getEtHomeworkInfo = function(hId) {
  return axios.http({
    url: '/admin/auth/getEtHomeworkInfo/' + hId,
    method: 'GET',
  });
};

