import '@/styles/index.scss';
import Vue from 'vue';
import './api/http';
import App from './App.vue';
import './icons';
import router from './router';
import store from './store';
import './utils';

// import '../mock';

import '@/components/common';

import LayoutStore from '@/layouts/index';
import Cookies from 'js-cookie';
import { resetRouter } from './router/index';

Vue.use(LayoutStore, {
  state: {
    isFixedNavBar: true,
    layoutMode: 'ltr',
    themeColor: 'theme_color_blue',
    theme: 'dark-side',
  },
  actions: {
    onLogout() {
      resetRouter();
      Cookies.remove('admin-token');
      router.replace({ name: 'login', });
    },
    toPersonalCenter() {
      router.push('/personal/center');
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
