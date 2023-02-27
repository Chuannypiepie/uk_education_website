import { UPLOAD_ROLES_LIST, ADD_ROLES_LIST, UPLOAD_PAGE_TOTAL } from '../modules-type/roles';
import { getRoleList } from '@/api/permission-role';
const state = {
  pageNo: 1,
  pageSize: 10,
  pageTotal: 0,
  rolesList: [],
};
const getters = {
  // 获取 角色 列表
  getRolesList(state) {
    return state.rolesList;
  },
  // 获取 角色列表 专属页码
  getPageInfo(state) {
    return {
      pageNo: state.pageNo,
      pageSize: state.pageSize,
      pageTotal: state.pageTotal,
    };
  },
  // 判断是否不是最后一页
  isCanNext: (state) => {
    if (state.pageNo < state.pageTotal || state.pageTotal === 0) {
      return true;
    }
    return false;
  },
};
const actions = {
  // 请求接口获取值
  async getRolesListAction({ state, commit, }) {
    if (state.pageNo >= state.pageTotal && state.pageTotal !== 0) {
      return;
    }
    const res = await getRoleList({
      pageNo: state.pageNo,
      pageSize: state.pageSize,
    });
    if (res.code !== 200) {
      this.$errorMsg('获取角色失败, 请刷新');
    }
    console.log('getRolesListAction', res);
    state.rolesList.push(...res.result.records);
    state.pageTotal = res.result.total;
    state.pageNo = res.result.current + 1;
  },
  // 更新总页码
};
const mutations = {
  // 添加 角色列表
  [ADD_ROLES_LIST](state, value) {
    state.rolesList.push(...value);
  },
  // 修改 角色列表 值
  [UPLOAD_ROLES_LIST](state, value) {
    state.rolesList = value;
  },
  // 修改 总页码
  [UPLOAD_PAGE_TOTAL](state, value) {
    state.pageTotal = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
