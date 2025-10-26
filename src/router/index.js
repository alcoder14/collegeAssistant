import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import ScheduleView from '@/views/ScheduleView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ExamsView from '@/views/ExamsView.vue';
import NotesView from '@/views/NotesView.vue';
import AssignmentsView from '@/views/AssignmentsView.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import NewPassword from '@/views/NewPassword.vue';
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
    path: '/reset-password',
    name: 'Reset Password',
    component: ResetPassword,
    meta: { requiresUnauth: true }
  },
  {
    path: '/set-new-password',
    name: 'Set New Password',
    component: NewPassword,
    meta: { requiresUnauth: true },
    redirect: '/login'
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: ScheduleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/exams',
    name: 'Exams',
    component: ExamsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NotesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/assignments',
    name: 'Assignments',
    component: AssignmentsView,
    meta: { requiresAuth: true }
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
      next('/');
    } else if (to.meta.requiresUnauth && auth.currentUser) {
      next('/schedule');
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
