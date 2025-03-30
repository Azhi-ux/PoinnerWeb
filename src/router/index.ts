import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
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
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectList
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetail
    },
    {
      path: '/user',
      name: 'user-center',
      component: UserCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/company',
      name: 'company-center',
      component: CompanyCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

export default router