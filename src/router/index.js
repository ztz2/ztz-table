import { createRouter, createWebHashHistory } from 'vue-router';
import About from '../views/about.vue';

const routes = [
  {
    path: '/',
    redirect: '/about',
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/start',
    name: 'start',
    component: () => import(/* webpackChunkName: "start" */ '../views/start.vue'),
  },
  {
    path: '/doc-element-plus',
    name: 'doc-element-plus',
    component: () => import(/* webpackChunkName: "start" */ '../views/doc/element-plus.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
