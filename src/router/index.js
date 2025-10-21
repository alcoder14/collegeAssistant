import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import { auth } from '@/firebase';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresUnauth: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
    meta: { requiresUnauth: true }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/home'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  // Firebase may not have user instantly, wait for auth init
  const checkAuth = () => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      next('/home');
    } else if (to.meta.requiresUnauth && auth.currentUser) {
      next('/projects');
    } else {
      next();
    }
  };

  if (user === null) {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe();
      checkAuth();
    });
  } else {
    checkAuth();
  }
});

export default router;
