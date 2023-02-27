/**
 * @class  - RoleModel
 * @classdesc 老师学生类 model
 */
export class RoleModel {
  /**
   * @constructor
   * @description 老师学生信息构造
   * @param {Object} Option - 传入职
   * @param {String} Option.userName - 名称
   * @param {String} Option.userEmail - 邮箱
   * @param {String} Option.userPhone - 电话
   * @param {String} Option.userAvatar - 头像
   * @param {String} Option.loginPassword - 登录密码
   * @param {Array<String>} Option.roleNames - 用户所有权限
   * @param {int} Option.isDel - 删除状态_0正常_1删除
   * @param {int} Option.createTime - 创建时间
   * @param {int} Option.updateTime - 修改时间
   * @param {int} Option.deleteTime - 删除时间
   */
  constructor({
    userName,
    userEmail,
    userPhone,
    userAvatar,
    loginPassword,
    roleNames,
    isDel,
    createTime,
    updateTime,
    deleteTime,
  }) {
    this.userName = userName ?? '';
    this.userEmail = userEmail ?? '';
    this.userPhone = userPhone ?? '';
    this.userAvatar = userAvatar ?? '';
    this.loginPassword = loginPassword ?? '';
    this.roleNames = roleNames ?? [];
    this.isDel = isDel ?? 0;
    this.createTime = (createTime ?? 0) !== 0 ? new Date(createTime * 1000) : '无记录';
    this.updateTime = (updateTime ?? 0) !== 0 ? new Date(updateTime * 1000) : '无记录';
    this.deleteTime = (deleteTime ?? 0) !== 0 ? new Date(deleteTime * 1000) : '无记录';
    Object.defineProperty(this, 'specialfield', {
      value: [ 'userName', 'userEmail', 'userPhone', 'userAvatar', 'loginPassword', 'roleNames', 'createTime', 'updateTime', 'deleteTime', ],
      enumerable: false,
    });
  }
/**   名称 */
userName
/**   邮箱 */
userEmail
/**   电话 */
userPhone
/**   头像 */
userAvatar
/**  登录密码 */
loginPassword
/**  用户所有权限 */
roleNames
/**  删除状态_0正常_1删除 */
isDel
/**  创建时间 */
createTime
/**  修改时间 */
updateTime
/**  删除时间 */
deleteTime
/** @returns {Map<String,any>} */
toMap() {
  var map = {
    'userName': this.userName,
    'userEmail': this.userEmail,
    'userPhone': this.userPhone,
    'userAvatar': this.userAvatar,
    'loginPassword': this.loginPassword,
    'roleNames': this.roleNames,
    'isDel': this.isDel,
    'createTime': this.updateTime instanceof Date ? this.createTime.getTime() : 0,
    'updateTime': this.updateTime instanceof Date ? this.updateTime.getTime() : 0,
    'deleteTime': this.updateTime instanceof Date ? this.deleteTime.getTime() : 0,
  };
  console.log(map);
  return map;
}
/**
 * @description 遍历类的键值对，并根据匹配的关键字来对其添加额外的信息
 * @return {Object} map 格式化后的对象
 * @memberof RoleModel
 */
toSpecialMap() {
  const map = {};
  Object.keys(this).forEach(element => {
    if (this.specialfield.includes(element)) {
      // map['pageParameter.' + element] = this[element];
      map[element] = this[element];
    } else {
      map[element] = this[element];
    }
  });
  return map;
}
}

/**
 * @class
 * @classdesc 权限列表阶段
 */
export class PermissioModel {
  /**
   * @constructor
   * @description 路由阶段
   * @param {Object} Option - 传入职
   * @param {String} Option.permissionName - 权限别名
   * @param {String} Option.permissionAlias - 权限别名
   * @param {int} Option.type - 类型
   * @param {String} Option.description - 描述
   * @param {int} Option.parentId - 父类id
   * @param {int} Option.rootId - 根id
   * @param {String} Option.path - 权限路径
   * @param {String} Option.redirect - 权限路径重新导向?
   * @param {String} Option.component - 组成
   * @param {String} Option.outerPath - 对外路径
   * @param {String} Option.icon - 图表
   * @param {int} Option.isShow - 是否展示
   * @param {int} Option.showStatus - 展示的状态
   */
  constructor({
    permissionName = '',
    permissionAlias = '',
    type = 1,
    description = '',
    parentId = 0,
    rootId = 0,
    path = '',
    redirect = '',
    component = '',
    outerPath = '',
    icon = '',
    isShow = 1,
    showStatus = 0,
  }) {
    this.permissionName = permissionName;
    this.permissionAlias = permissionAlias;
    this.type = type;
    this.description = description;
    this.parentId = parentId;
    this.rootId = rootId;
    this.path = path;
    this.redirect = redirect;
    this.component = component;
    this.outerPath = outerPath;
    this.icon = icon;
    this.isShow = isShow;
    this.showStatus = showStatus;
  }
  /** @returns {Map<String,any>} 啊 */
  toMap() {
    var map = {
      'permissionName': this.permissionName,
      'permissionAlias': this.permissionAlias,
      'type': this.type,
      'description': this.description,
      'parentId': this.parentId,
      'rootId': this.rootId,
      'path': this.path,
      'redirect': this.redirect,
      'component': this.component,
      'outerPath': this.outerPath,
      'icon': this.icon,
      'isShow': this.isShow,
      'showStatus': this.showStatus,
    };
    return map;
  }
  toSpecialMap() {
    const map = {};
    Object.keys(this).forEach(key => {
      map[key] = this[key];
    });
    return map;
  }
}

/**
 * @class
 * @classdesc 课程节点
 */
export class LessonModel {
  /**
   * @constructor
   * @description 构造函数
   * @param {int} id - 课程id_课程审核id（取决调用的是课程的接口还是关于审核的接口）
   * @param {int} curriculumId - 课程主体id（课程id）
   * @param {String} curriculumName - 课程名称
   * @param {String} curriculumDescribe - 课程描述
   * @param {String} curriculumType - 课程类型
   * @param {String} conferenceCode - 课程会议编码
   * @param {String} conferencePassword - 课程会议密码
   * @param {String} conferenceLink - 课程会议链接
   * @param {int} type - 类型一对一（1）或一对多（0）
   * @param {int} startTime - 开始时间
   * @param {int} endTime - 结束时间
   * @param {int} masterId - 教师id
   * @param {int} isDel - 删除状态_1删除_0正常
   * @param {int} createTime - 创建时间
   * @param {int} updateTime - 修改时间
   * @param {int} deleteTime - 删除时间
   * @param {Array<int>} students - 学生id数组
   * @param {int} status - 审核状态
   */
  constructor({
    id,
    curriculumId,
    curriculumName,
    curriculumDescribe,
    curriculumType,
    conferenceCode,
    conferencePassword,
    conferenceLink,
    type,
    startTime,
    endTime,
    masterId,
    isDel,
    createTime,
    updateTime,
    deleteTime,
    students,
    status,
  }) {
    this.id = id;
    this.curriculumId = curriculumId;
    this.curriculumName = curriculumName;
    this.curriculumDescribe = curriculumDescribe;
    this.curriculumType = curriculumType;
    this.conferenceCode = conferenceCode;
    this.conferencePassword = conferencePassword;
    this.conferenceLink = conferenceLink;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
    this.masterId = masterId;
    this.isDel = isDel;
    this.createTime = createTime;
    this.updateTime = updateTime;
    this.deleteTime = deleteTime;
    this.students = students;
    this.status = status;
  }
  /** 课程id_课程审核id（取决调用的是课程的接口还是关于审核的接口） */
  id;
  /** 课程主体id（课程id） */
  curriculumId;
  /** 课程名称 */
  curriculumName;
  /** 课程描述 */
  curriculumDescribe;
  /** 课程类型 */
  curriculumType;
  /** 课程会议编码 */
  conferenceCode;
  /** 课程会议密码 */
  conferencePassword;
  /** 课程会议链接 */
  conferenceLink;
  /** 类型一对一（1）或一对多（0） */
  type;
  /** 开始时间 */
  startTime;
  /** 结束时间 */
  endTime;
  /** 教师id */
  masterId;
  /** 删除状态_1删除_0正常 */
  isDel;
  /** 创建时间 */
  createTime;
  /** 修改时间 */
  updateTime;
  /** 删除时间 */
  deleteTime;
  /** 学生id数组 */
  students;
  /** 审核状态 */
  status;
  /** @returns {Map<String,any>} */
  toMpa() {
    var map = {
      'id': this.id,
      'curriculumId': this.curriculumId,
      'curriculumName': this.curriculumName,
      'curriculumDescribe': this.curriculumDescribe,
      'curriculumType': this.curriculumType,
      'conferenceCode': this.conferenceCode,
      'conferencePassword': this.conferencePassword,
      'conferenceLink': this.conferenceLink,
      'type': this.type,
      'startTime': this.startTime,
      'endTime': this.endTime,
      'masterId': this.masterId,
      'isDel': this.isDel,
      'createTime': this.createTime,
      'updateTime': this.updateTime,
      'deleteTime': this.deleteTime,
      'students': this.students,
      'status': this.status,
    };
    return map;
  }
}

/**
 * @class
 * @classdesc 角色列
 */
export class RoleItem {
  /**
   * @constructor
   * @param {object} Object -传入值
   * @param {String} Object.roleId - 角色id
   * @param {String} Object.roleName - 角色名称
   * @param {String} Object.roleAlias - 角色昵称
   * @param {String} Object.description - 角色描述
   * @param {Array<String>} Object.permissionNames -角色权限列表
   * @param {Number} Object.status - 角色状态问后端
   * @param {Number} Object.deleteTime - 删除时间
   * @param {Number} Object.createTime - 创建时间
   * @param {Number} Object.updateTime - 更新时间
   */
  constructor({
    description = '',
    roleAlias = '',
    permissionNames = [],
    roleId = 0,
    roleName = '',
    status = 0,
    deleteTime = 0,
    createTime = 0,
    updateTime = 0,
  }) {
    this.description = description;
    this.roleAlias = roleAlias;
    this.permissionNames = permissionNames;
    this.roleId = roleId;
    this.roleName = roleName;
    this.status = status;
    this.deleteTime = deleteTime !== 0 ? new Date(deleteTime * 1000) : '无记录';
    this.createTime = createTime !== 0 ? new Date(createTime * 1000) : '无记录';
    this.updateTime = updateTime !== 0 ? new Date(updateTime * 1000) : '无记录';
  }
  /** 角色id */
  description;
  /** 角色名称 */
  roleAlias;
  /** 角色昵称 */
  permissionNames;
  /** 角色描述 */
  roleId;
  /** 角色权限列表 */
  roleName;
  /** 角色状态问后端 */
  status;
  /** 删除时间 */
  deleteTime;
  /** 创建时间 */
  createTime;
  /** 更新时间 */
  updateTime;
  /**
   * @returns {Map<String,any>}
   */
  toMap() {
    var map = {
      'description': this.description,
      'roleAlias': this.roleAlias,
      'permissionNames': this.permissionNames,
      'roleId': this.roleId,
      'roleName': this.roleName,
      'status': this.status,
      'deleteTime': this.updateTime instanceof Date ? this.deleteTime.getTime() : 0,
      'createTime': this.updateTime instanceof Date ? this.createTime.getTime() : 0,
      'updateTime': this.updateTime instanceof Date ? this.updateTime.getTime() : 0,
    };
    return map;
  }
}

/**
 * @class
 * @classdesc 权限列表
 */
export class permissioModel {
  constructor(id) {
    this.id = id;
  }
}

/**
 * @class
 * @classdesc 作业类 model
 */
export class HomeWorkModel {
  /**
  *  @constructor
  *  @param {Object} object --传入值
  *  @param {int} object.id  - 作业id/作业审核id
  *  @param {int} object.homeworkId - 主体作业id
  *  @param {int} object.curriculumHomeworkId - 所在的作业目录id
  *  @param {String} object.homeworkDescribe - 描述
  *  @param {String} object.homeworkComment - 评价
  *  @param {String} object.homeworkLink - 链接
  *  @param {int} object.homeworkScore - 评分
  *  @param {int} object.studentId - 学生id
  *  @param {int} object.masterId - 老师id
  *  @param {int} object.curriculumId - 课程id
  *  @param {int} object.createTime - 创建时间
  *  @param {int} object.updateTime - 修改时间
  *  @param {int} object.status - 审核状态 0申请中 1.同意 2.拒绝
  */
  constructor(
    { id,
      homeworkId,
      curriculumHomeworkId,
      homeworkDescribe,
      homeworkComment,
      homeworkLink,
      homeworkScore,
      studentId,
      masterId,
      curriculumId,
      createTime,
      updateTime,
      status, }
  ) {
    this.id = id ?? 0;
    this.homeworkId = homeworkId ?? 0;
    this.curriculumHomeworkId = curriculumHomeworkId ?? 0;
    this.homeworkDescribe = homeworkDescribe ?? '';
    this.homeworkComment = homeworkComment ?? '';
    this.homeworkLink = homeworkLink ?? '';
    this.homeworkScore = homeworkScore ?? 0;
    this.studentId = studentId ?? 0;
    this.masterId = masterId ?? 0;
    this.curriculumId = curriculumId ?? 0;
    this.createTime = (createTime ?? 0) !== 0 ? new Date(createTime * 1000) : '无记录';
    this.updateTime = (updateTime ?? 0) !== 0 ? new Date(updateTime * 1000) : '无记录';
    this.status = status ?? 0;
  }
  /** 作业id/作业审核id（视调用接口）*/
  id;
  /* 主体作业id*/
  homeworkId;
  /* 所在的作业目录id*/
  curriculumHomeworkId;
  /* 描述*/
  homeworkDescribe;
  /* 评价*/
  homeworkComment;
  /* 链接*/
  homeworkLink;
  /* 评分*/
  homeworkScore;
  /* 学生id*/
  studentId;
  /* 老师id*/
  masterId;
  /* 课程id*/
  curriculumId;
  /* 创建时间*/
  createTime;
  /* 修改时间*/
  updateTime;
  /* 审核状态 0申请中 1.同意 2.拒绝 */
  status;
  /**
   * @method
   * @description  变成Map吧>_<※
   * @return {Map<String,any>}
   * */
  toMap() {
    var map = {
      'id': this.id,
      'homeworkId': this.homeworkId,
      'curriculumHomeworkId': this.curriculumHomeworkId,
      'homeworkDescribe': this.homeworkDescribe,
      'homeworkComment': this.homeworkComment,
      'homeworkLink': this.homeworkLink,
      'homeworkScore': this.homeworkScore,
      'studentId': this.studentId,
      'masterId': this.masterId,
      'curriculumId': this.curriculumId,
      'createTime': this.createTime.getTime(),
      'updateTime': this.updateTime.getTime(),
      'status': this.status,
    };
    return map;
  }
  toSpecialMap() {
    const map = {};
    Object.keys(this).forEach(element => {
      if (this.specialfield.includes(element)) {
        map['pageParameter.' + element] = this[element];
        // map[element] = this[element];
      } else {
        map[element] = this[element];
      }
    });
    return map;
  }
}

/**
 * @class
 * @classdesc 页码相关类
 */
export class PageParameter {
  /** 页码 */
  pageNo;
  /** 页面大小 */
  pageSize;
  /**  总数*/
  totalSize;
  /** 搜索词 */
  searchWord;
  /** 0倒序_1升序 */
  orderByTime;
  /** 开始的时间戳_单位0 */
  startTime;
  /** 结束时间戳_单位0 */
  endTime;
  /**
   *
   * @param {number} pageNo 页码
   * @param {number} pageSize 页面大小
   * @param {number} totalSize 总数
   * @param {String} searchWord 搜索词
   * @param {int} orderByTime  0倒序_1升序
   * @param {int} startTime - 开始的时间戳_单位0
   * @param {int} endTime - 结束时间戳_单位0
   */
  constructor(
    { pageNo = 1,
      pageSize = 10,
      totalSize = 0,
      searchWord = null,
      orderByTime = 0,
      startTime = null,
      endTime = null, }
  ) {
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.totalSize = totalSize;
    this.searchWord = searchWord;
    this.orderByTime = orderByTime;
    this.startTime = startTime;
    this.endTime = endTime;
    Object.defineProperty(this, 'specialfield', {
      value: [ 'pageNo', 'pageSize', 'totalSize', 'searchWord', 'orderByTime', 'startTime', 'endTime', ],
      enumerable: false,
    });
  }
  // toMap() {
  //   var map = {
  //     'pageParameter.pageNo': this.pageNo,
  //     'pageParameter.pageSize': this.pageSize,
  //     'pageParameter.totalSize': this.totalSize,
  //     'pageParameter.searchWord': this.searchWord,
  //     'pageParameter.orderByTime': this.orderByTime,
  //     'pageParameter.startTime': this.startTime,
  //     'pageParameter.endTime': this.endTime,
  //     // 'pageParameter.startTime': this.startTime ? Number(this.startTime / 1000) : null,
  //     // 'pageParameter.endTime': this.endTime ? Number(this.endTime / 1000) : null,
  //   };
  //   return map;
  // }

  // 遍历全部属性并返回 -- 可按需要添加去重
  toMap() {
    const map = {};
    Object.keys(this).forEach(element => {
      map[element] = this[element];
    });
    return map;
  }
  // 取重属性并在属性头部添加 pageParameter. 字段(接口要求字段), 不属于类基础属性的不用添加关键字段(不是类里面原生的属性, 是后来添加进来的)
  toSpecialMap(additionalList = [], additionalString = 'pageParameter') {
    const map = {};
    Object.keys(this).forEach(element => {
      if (this.specialfield.includes(element) || additionalList.includes(element)) {
        map[additionalString + '.' + element] = this[element];
      } else {
        map[element] = this[element];
      }
    });
    return map;
  }
}

