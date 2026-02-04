import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
      },
      {
        path: 'vocabularies',
        name: 'Vocabularies',
        component: () => import('../pages/Vocabularies.vue'),
      },
      {
        path: 'sentences',
        name: 'Sentences',
        component: () => import('../pages/Sentences.vue'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../pages/Categories.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../pages/Users.vue'),
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('../pages/Statistics.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
