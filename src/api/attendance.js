import * as axios from './http.js';

/**
 * @description 方式GET 获取出勤记录
 * @host /admin/auth/getAttendancePageInfo
 * @param {Object} Option - 传入值
 * @param {String} Option.role - 获取的角色出勤：0全部、1老师、2学生
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.type -  获取的出勤类型：0全部、1准时、2迟到
 * @param {String} Option.timeOrder -  时间排序：0最近开始、1最远开始
 * @param {String} Option.userId -  用户id，传该值时 role必须等于 1或2
 */
export const getAttendancePageInfo = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/attendance/getAttendancePageInfo',
    method: 'GET',
    data: {
      ...pageParameter.toMap(),
    },
  });
};

/**
 * @description 方式GET 分页查询 请假信息
 * @host /admin/auth/getEtAskOffPage
 * @param {Object} Option - 传入值
 * @param {EtAskOffModel} Option.etAskOffModel - 应该是审核出勤返回
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord -  获取的出勤类型：0全部、1准时、2迟到
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  用户id，传该值时 role必须等于 1或2
 * @param {String} Option.endTime -  用户id，传该值时 role必须等于 1或2
 */
export const getEtAskOffPage = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/attendance/getEtAskOffPage',
    method: 'GET',
    data: {
      ...pageParameter.toSpecialMap(),
    },
  });
};

/**
 * @description 方式GET 查看请假详细信息
 * @host /admin/auth/getEtAskOffInfo/{askOffId}
 * @param {int} askOffId - 请假审批id
 * */
export const getEtAskOffInfo = function(askOffId) {
  return axios.http({
    url: '/admin/auth/getEtAskOffInfo/' + askOffId,
    method: 'GET',
  });
};

/**
 * @description 方式POST 审批请假记录
 * @host /admin/auth/approvalAskOff
 * @param {Object} Option - 传入值
 * @param {EtAskOffModel} Option.etAskOffModel - 应该是审核出勤返回
 * @param {String} Option.pageNo -  页码
 * @param {String} Option.pageSize -  页面大小
 * @param {String} Option.searchWord - 搜索关键词
 * @param {String} Option.timeType -  时间排序：0最近开始、1最远开始
 * @param {String} Option.startTime -  创建/注册时间区间 大于该值
 * @param {String} Option.endTime -  创建/注册时间区间 小于该值
 * */
export const approvalAskOff = function({
  askIds,
  status,
  refuseReason,
}) {
  return axios.http({
    url: '/admin/attendance/approvalAskOff',
    method: 'POST',
    data: {
      askIds,
      status,
      refuseReason,
    },
  });
};

/**
 * @description 方式GET 获取课程改期设置
 * @host /admin/auth/getTimeOptions
 * */
export const getTimeOptions = function() {
  return axios.http({
    url: '/admin/attendance/getTimeOptions',
    method: 'GET',
  });
};

/**
 * @description post 设置课程延期的最大延期天数(为0只能在24h内调整)
 * @host /admin/auth/setIntervalType
 * @param {Object} Option - 传入值
 * @param {int} Option.startTime - 最短时间\？\最早开始时间
 * @param {int} Option.endTime - 最长时间\最大延期天数\最晚结束时间
 * */
export const setIntervalType = function({ startTime, endTime, }) {
  return axios.http({
    url: '/admin/auth/setIntervalType',
    method: 'POST',
    data: {
      startTime,
      endTime,
    },
  });
};

/**
 * @description post 设置每天可以进行授课的时段(参数区间0~24)
 * @host /admin/auth/setDelayType
 * @param {Object} Option - 传入值
 * @param {int} Option.startTime - 最短时间\？\最早开始时间
 * @param {int} Option.endTime - 最长时间\最大延期天数\最晚结束时间
 * */
export const setDelayType = function({ startTime, endTime, }) {
  return axios.http({
    url: '/admin/auth/setDelayType',
    method: 'POST',
    data: {
      startTime,
      endTime,
    },
  });
};

/**
 * @description post 设置课程的最短时间与最长时间
 * @host /admin/auth/setMaxOrMinType
 * @param {Object} Option - 传入值
 * @param {int} Option.startTime - 最短时间\？\最早开始时间
 * @param {int} Option.endTime - 最长时间\最大延期天数\最晚结束时间
 * */
export const setMaxOrMinType = function({ startTime, endTime, }) {
  return axios.http({
    url: '/admin/auth/setMaxOrMinType',
    method: 'POST',
    data: {
      startTime,
      endTime,
    },
  });
};

/**
 * @class
 * @classdesc 应该是审核出勤返回
 */
export class EtAskOffModel {
  /**
  *  @constructor
  *  @param {Object} object --传入值
  *  @param {int} object.id  - ???
  *  @param {int} object.askOffReason - 理由
  *  @param {int} object.refuseReason - 拒绝原因
  *  @param {String} object.type - 角色类型_1老师_0学生
  *  @param {String} object.userId - 角色id
  *  @param {String} object.curriculumId - 课程id
  *  @param {int} object.status - 审核状态_0待审核_1同意_2拒绝
  *  @param {int} object.updateCurriculumTime - 提交的_课程改期时间
  *  @param {int} object.startTime - 申请时间
  *  @param {int} object.endTime - 审核时间
  *  @param {int} object.createTime - 创建时间
  */
  constructor({
    id,
    askOffReason,
    refuseReason,
    type,
    userId,
    curriculumId,
    status,
    updateCurriculumTime,
    startTime,
    endTime,
    createTime,
  }) {
    this.id = id;
    this.askOffReason = askOffReason;
    this.refuseReason = refuseReason;
    this.type = type;
    this.userId = userId;
    this.curriculumId = curriculumId;
    this.status = status;
    this.updateCurriculumTime = updateCurriculumTime;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.createTime = createTime;
  }
  /** ??? */
  id;
  /** 理由 */
  askOffReason;
  /** 拒绝原因 */
  refuseReason;
  /** 角色类型_1老师_0学生 */
  type;
  /** 角色id */
  userId;
  /** 课程id */
  curriculumId;
  /** 审核状态_0待审核_1同意_2拒绝 */
  status;
  /** 提交的_课程改期时间 */
  updateCurriculumTime;
  /** 申请时间 */
  startTime;
  /** 审核时间 */
  endTime;
  /** 创建时间 */
  createTime;
  toMap() {
    var map = {
      'id': this.id,
      'askOffReason': this.askOffReason,
      'refuseReason': this.refuseReason,
      'type': this.type,
      'userId': this.userId,
      'curriculumId': this.curriculumId,
      'status': this.status,
      'updateCurriculumTime': this.updateCurriculumTime,
      'startTime': this.startTime,
      'endTime': this.endTime,
      'createTime': this.createTime,
    };
    return map;
  }
}

