import router from '@/router';
import Mock from 'mockjs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import store from '@/store';
// import service from '@/api/axios.config';
import LayoutStore, { Layout } from '@/layouts/index';
import { routes as constantRoutes } from '@/router';
// import { baseAddress, getMenuListByRoleId } from '@/api/url';

import Cookies from 'js-cookie';
import { toHump } from './utils';
import * as userApi from '@/api/manage-users';

// 页面进度条
NProgress.configure({ showSpinner: false, });

/** 丛云端获取模板 */
function getRoutes() {
  return userApi.getUsemenu().then(res => {
    // console.log();
    const data = res.result.filter(it => it.type === 1);
    return generatorRoutes(data);
  });
  /* return service({
    url: baseAddress + getMenuListByRoleId,
    method: 'POST',
    data: {
      userId: '1',
      roleId: '1',
    },
  }).then(res => {
    console.log('云端上获取到的路由', res);
    return generatorRoutes(res.data);
  }); */
}

/**  根据类型引入模板 有子元素和没子元素模板 */
function getComponent(it) {
  return resolve => {
    if (it.children && it.children.length > 0) {
      require([ '@/layouts/RouterViewLayout.vue', ], resolve);
    } else {
      require([ '@/views' + it.path, ], resolve);
    }
  };
}

/** 匹配 paht 返回匹配数 */
/* function getCharCount(str, char) {
  var regex = new RegExp(char, 'g');
  var result = str.match(regex);
  var count = !result ? 0 : result.length;
  return count;
} */

/** 如果有 / 说明是菜单 */
function isMenu(menu) {
  // return getCharCount(path, '/') === 1;
  if (menu.children && menu.children.length > 0) {
    return true;
  }
  return false;
}
/** 根据路径显示名字 */
function getNameByUrl(menuUrl) {
  const temp = menuUrl.split('/');
  return toHump(temp[temp.length - 1]);
}

/** 递归遍历并生成路由模板 */
/* function generatorRoutes(res) {
  const tempRoutes = [];
  res.forEach(it => {
    const route = {
      path: it.menuUrl,
      name: getNameByUrl(it.menuUrl),
      hidden: !!it.hidden,
      component: isMenu(it.menuUrl) ? Layout : getComponent(it),
      meta: {
        title: it.menuName,
        affix: !!it.affix,
        cacheable: !!it.cacheable,
        icon: it.icon || '',
        tip: it.tip,
      },
    };
    if (it.children) {
      route.children = generatorRoutes(it.children);
    }
    tempRoutes.push(route);
  });
  return tempRoutes;
} */
function generatorRoutes(res, parent = {}) {
  const tempRoutes = [];
  res.forEach(it => {
    const route = {
      path: it.path || '/' + Mock.Random.word(3, 5),
      name: getNameByUrl(it.path) || Mock.Random.word(3, 5),
      hidden: it.showStatus !== 0,
      component: isMenu(it) ? Layout : getComponent(it),
      meta: {
        title: it.alias,
        affix: !!it.affix,
        cacheable: !!it.cacheable,
        icon: it.meta.icon || '',
        tip: it.tip || '',
      },
    };
    if (it.children) {
      route.children = generatorRoutes(it.children, route);
    }
    tempRoutes.push(route);
  });
  return tempRoutes;
}

/**  获取会话cookies[admin-token] ture:有 false:无 */
function isTokenExpired() {
  const token = Cookies.get('admin-token');
  return !!token;
}

const whiteList = [ 'login', ];

router.beforeEach((to, from, next) => {
  NProgress.start();
  // 如果白名单里面包含 名字 直接进入
  if (whiteList.includes(to.name)) {
    next();
    NProgress.done();
  } else {
    // 不在 先验证是否有token在进入 没有的话无法进入任何新页面
    if (!isTokenExpired()) {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    } else {
      // 没有token 判断 permissionRoutes 是否为空
      const isEmptyRoute = LayoutStore.isEmptyPermissionRoute();
      // 如果是permissionRoutes空的
      if (isEmptyRoute) {
        // 重新在云端加载路由
        const accessRoutes = [];
        getRoutes().then(async routes => {
          console.log('getRoutes', routes);
          accessRoutes.push(...routes);
          accessRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true,
          });
          console.log('LayoutStore', Mock.Random.url('http'));
          // 将路由放进去permissionRoutes
          LayoutStore.initPermissionRoute([ ...constantRoutes, ...accessRoutes, ]);
          // 添加路由
          router.addRoutes(accessRoutes);
          // 跳转
          next({ ...to, replace: true, });
        });
      } else {
        // 如果是permissionRoutes不空的
        next();
      }
    }
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});
