// export const baseAddress = 'http://localhost:8080';
export const baseAddress = 'http://ukedunet.pkl.cc:18080';

// 管理用户

/**
 * 获取用户菜单
 * 方式Get
 */
export const getUsemenu = '/admin/auth/getAdminCanUseMenu';
/**
 * 获取用户信息结构
 * 方式Get
 */
export const getUseInfo = '/admin/auth/getUserInfoStructure';

/**
 * 获取权限列表
 * 方法GET
 */
export const getPermissionList = '/admin/auth/getPermissionList';

/**
 * 后台登录
 * 方式post
 * @param String account 账号
 * @param password password 账号
 */
export const login = '/poittjjj';

export const updateUserInfo = '/updateUser';

export const addUserInfo = '/addUser';

export const getMenuListByRoleId = '/getMenuListByRoleId';

export const getAllMenuByRoleId = '/getAllMenuByRoleId';

export const deleteUserById = '/deleteUserById';

export const getDepartmentList = '/getDepartmentList';

export const addDepartment = '/addDepartment';

export const getRoleList = '/getRoleList';

export const getMenuList = '/getMenuList';

export const getParentMenuList = '/getParentMenuList';

export const getTableList = '/getTableList';

export const getCardList = '/getCardList';

export const getCommentList = '/getCommentList';
