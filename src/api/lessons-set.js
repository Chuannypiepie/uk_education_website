import * as axios from './http.js';
import { LessonModel } from './model.js';
LessonModel;

/**
 * @desc POST 为老师添加修改关联课程
 * @host /admin/auth/allotMasterCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const allotMasterCurriculum = function({
  lessonModel,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime,
}) {
  return axios.http({
    url: '/admin/auth/allotMasterCurriculum',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
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
 * @desc POST 为学生关联课程
 * @host /admin/auth/allotStudentCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const allotStudentCurriculum = function({
  curriculumId,
  userIds,
}) {
  return axios.http({
    url: '/admin/curriculum/allotStudentCurriculum',
    method: 'POST',
    data: {
      curriculumId,
      userIds,
    },
  });
};

/**
 * @desc POST 取消学生关联的课程
 * @host /admin/auth/removeStudentCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const removeStudentCurriculum = function({
  curriculumId,
  userIds,
}) {
  console.log(curriculumId, userIds);
  return axios.http({
    url: '/admin/curriculum/removeStudentCurriculum',
    method: 'DELETE',
    data: {
      curriculumId,
      userIds,
    },
  });
};

/**
 * @desc POST 后台添加课程
 * @host /admin/auth/addCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const addCurriculum = function({
  lessonModel,
}) {
  return axios.http({
    url: '/admin/curriculum/addCurriculum',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
    },
  });
};

/**
 * @desc POST 修改课程信息
 * @host /admin/auth/updateCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const updateCurriculum = function({
  lessonModel,
}) {
  return axios.http({
    url: '/admin/curriculum/updateCurriculum',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
    },
  });
};

/**
 * @desc DELETE 删除课程 假删除
 * @host /admin/auth/deleteCurriculum/
 * @param {Object} option - 传入值
 * @param {int} option.cid	 - 应该是课程id吧
 * @returns {object} 返回值
 */
export const deleteCurriculum = function({
  cid,
}) {
  return axios.http({
    url: '/admin/curriculum/deleteCurriculum/' + cid,
    method: 'DELETE',
  });
};

/**
 * @desc POST 分页多条件查询 课程信息
 * @host /admin/auth/getPageCurriculumInfo
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.type	 - 类型 一对一（1）或一对多（0）
 * @param {LessonModel} option.startTime	 - 开始时间
 * @param {LessonModel} option.endTime	 - 结束时间
 * @param {LessonModel} option.masterId	 - 教师id
 * @param {LessonModel} option.isDel	 - 删除状态 1删除 0正常
 * @param {LessonModel} option.pageParameter.pageNo	 - 页码
 * @param {LessonModel} option.pageParameter.pageSize	 - 页大小
 * @param {LessonModel} option.pageParameter.searchWord	 - 搜索词
 * @param {LessonModel} option.pageParameter.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.pageParameter.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.pageParameter.endTime	 - 创建/注册时间区间 小于该值
 * @param {LessonModel} option.studentId	 - 学生id
 * @param {LessonModel} option.curriculumStatus	 - 当前课程状态: 0待完成、1完成、2取消
 * @returns {object} 返回值
 */
export const getPageCurriculumInfo = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/curriculum/getPageCurriculumInfo',
    method: 'GET',
    data: {
      ...pageParameter.toSpecialMap([ 'timeType', ]),
      startTime: pageParameter.courseStartTime / 1000 || null,
      endTime: pageParameter.courseEndTime / 1000 || null,
    },
  });
};

/**
 * @desc POST 审批课程
 * @host /admin/auth/approvalCurriculum
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const approvalCurriculum = function({
  lessonModel,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime,
}) {
  return axios.http({
    url: '/admin/auth/approvalCurriculum',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
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
 * @desc POST 查询课程审核记录
 * @host /admin/auth/getPageCurriculumCheck
 * @param {Object} option - 传入值
 * @param {LessonModel} option.lessonModel	 - 课程信息
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const getPageCurriculumCheck = function({
  lessonModel,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime,
}) {
  return axios.http({
    url: '/admin/auth/getPageCurriculumCheck',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
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
 * @desc GET 查询课程详细信息
 * @host /admin/auth/getCurriculumCheckInfo/
 * @param {Object} option - 传入值
 * @param {int} option.cid	 - 应该是课程id吧
 * @returns {object} 返回值
 */
export const getCurriculumCheckInfo = function({
  CCid,
}) {
  return axios.http({
    url: '/admin/curriculum/getCurriculumCheckInfo/' + CCid,
    method: 'GET',
  });
};

/**
 * @desc POST 多条件分页查询 课程资料
 * @host /admin/auth/getCurriculumDataPageInfo
 * @param {Object} option - 传入值
 * @param {int} option.id	 - ???
 * @param {LessonModel} option.dataLink	 - 教学资料链接
 * @param {LessonModel} option.dataName	 - 资料名称
 * @param {LessonModel} option.content	 - 备注、作用
 * @param {LessonModel} option.curriculumId	 - 课程id
 * @param {LessonModel} option.masterId	 - 老师id
 * @param {LessonModel} option.status	 - 审核状态 0待审核、1同意、2拒绝
 * @param {LessonModel} option.createTime	 - 创建时间
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const getCurriculumDataPageInfo = function({
  pageParameter,
}) {
  return axios.http({
    url: '/admin/curriculum/getCurriculumDataPageInfo',
    method: 'GET',
    data: {
      ...pageParameter.toSpecialMap(),
    },
  });
};

/**
 * @desc POST 审批课程资料
 * @host /admin/auth/approvalCurriculumData
 * @param {Object} option - 传入值
 * @param {int} option.id	 - ???
 * @param {LessonModel} option.dataLink	 - 教学资料链接
 * @param {LessonModel} option.dataName	 - 资料名称
 * @param {LessonModel} option.content	 - 备注、作用
 * @param {LessonModel} option.curriculumId	 - 课程id
 * @param {LessonModel} option.masterId	 - 老师id
 * @param {LessonModel} option.status	 - 审核状态 0待审核、1同意、2拒绝
 * @param {LessonModel} option.createTime	 - 创建时间
 * @param {LessonModel} option.pageNo	 - 页码
 * @param {LessonModel} option.pageSize	 - 页大小
 * @param {LessonModel} option.searchWord	 - 搜索词
 * @param {LessonModel} option.timeType	 - 按创建时间排序 0倒序，1升序
 * @param {LessonModel} option.startTime	 - 创建/注册时间区间 大于该值
 * @param {LessonModel} option.endTime	 - 创建/注册时间区间 小于该值
 * @returns {object} 返回值
 */
export const approvalCurriculumData = function({
  permissionId,
  lessonModel,
  pageNo,
  pageSize,
  searchWord,
  timeType,
  startTime,
  endTime,
}) {
  return axios.http({
    url: '/admin/auth/approvalCurriculumData',
    method: 'POST',
    data: {
      ...lessonModel.toMpa(),
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
