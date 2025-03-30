import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import MainLayout from '../components/layout/MainLayout.vue'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ProjectList from '../views/projects/ProjectList.vue'
import ProjectDetail from '../views/projects/ProjectDetail.vue'
import UserCenter from '../views/user/UserCenter.vue'
import CompanyCenter from '../views/company/CompanyCenter.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'about',
          name: 'about',
          component: About
        },
        {
          path: 'login',
          name: 'login',
          component: Login,
          meta: { guest: true }
        },
        {
          path: 'register',
          name: 'register',
          component: Register,
          meta: { guest: true }
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectList
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: ProjectDetail
        },
        {
          path: 'user',
          name: 'user-center',
          component: UserCenter,
          meta: { requiresAuth: true }
        },
        {
          path: 'company',
          name: 'company-center',
          component: CompanyCenter,
          meta: { requiresAuth: true, requiresCompany: true }
        },
        {
          path: 'admin',
          name: 'admin-dashboard',
          component: AdminDashboard,
          meta: { requiresAuth: true, requiresAdmin: true }
        }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if the route requires admin role
  if (to.meta.requiresAdmin && userStore.currentUser?.role !== 'admin') {
    next({ name: 'home' })
    return
  }

  // Check if the route requires company role
  if (to.meta.requiresCompany && userStore.currentUser?.role !== 'company') {
    next({ name: 'home' })
    return
  }

  // Prevent authenticated users from accessing login/register pages
  if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router