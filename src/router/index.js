import Vue from 'vue';
import VueRouter from 'vue-router';

import { Layout } from '@/layouts/index';

import NextPageInfo from './next-page/routes';

Vue.use(VueRouter);

// 这里捕获重复跳转错误让他不显示
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  console.log(location);
  if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject); }
  return originalPush.call(this, location).catch(err => err);
};

export const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/index/main',
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  ...NextPageInfo,
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/personal',
    name: 'personal',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'center',
        name: 'personalCenter',
        component: () => import('@/views/personal'),
        meta: {
          title: '个人中心',
        },
      },
      {
        path: '/messageManage/room-log/:id',
        name: 'roomLog',
        component: () => import('@/views/messageManage/room-log.vue'),
        meta: {
          title: '查看消息记录',
        },
      },
    ],
  },
  // {
  //   path: '/messageManage',
  //   name: 'messageManage',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //   ],
  // },
  /* {
    path: '/index',
    name: 'index',
    component: Layout,
    hidden: false,
    meta: {
      title: 'Dashboard',
      icon: 'dashboard',
    },
    children: [
      {
        path: 'main',
        name: 'Main',
        component: () => import('@/views/index'),
        meta: {
          title: '主控台',
          affix: true,
          cacheable: true,
        },
      },
      {
        path: 'workplace',
        name: 'WorkPlace',
        component: () => import('@/views/index/work-place'),
        meta: {
          title: '工作台',
          cacheable: true,
        },
      },
      {
        path: 'ftl',
        name: 'ftl',
        component: () => import('@/views/ftl'),
        meta: {
          title: '角色管理',
          cacheable: true,
        },
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('@/views/system/permissions.vue'),
        meta: {
          title: '权限管理',
          cacheable: true,
        },
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/student'),
        meta: {
          title: '学生页面',
          cacheable: true,
        },
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/teacher'),
        meta: {
          title: '老师页面',
          cacheable: true,
        },
      },
    ],
  }, */
  /* {
    path: '/homeWork',
    name: 'homeWork',
    component: Layout,
    hidden: false,
    meta: {
      title: '作业相关',
      icon: 'homeWork',
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/homeWork/homework-view.vue'),
        meta: {
          title: '作业列表',
          cacheable: true,
        },
      },
      {
        path: 'approve',
        name: 'approve',
        component: () => import('@/views/homeWork/approve-homework.vue'),
        meta: {
          title: '审批作业',
          cacheable: true,
        },
      },
    ],
  }, */
];

const createRouter = () => new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0, }),
  routes,
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
