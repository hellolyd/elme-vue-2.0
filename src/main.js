// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// 引入goods.vue组件
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

let routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];
const router = new VueRouter({
  routes,
  // 配置简写active
  linkActiveClass: 'active'
});

// router.push('/goods');

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 不能挂在到body或html上
  router,
  components: {App},
  template: '<App/>'
});
