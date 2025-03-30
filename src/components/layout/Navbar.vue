<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <img src="/vite.svg" alt="Logo" class="h-8 w-8">
            <span class="text-xl font-bold text-gray-900">创业平台</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-blue-600 transition-colors"
            :class="{ 'text-blue-600': isCurrentRoute(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click">
              <div class="flex items-center space-x-2 cursor-pointer">
                <el-avatar :size="32" :src="userStore.currentUser?.avatar || ''" />
                <span class="text-gray-700">{{ userStore.currentUser?.username }}</span>
                <el-icon><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="navigateToUserCenter">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link 
              to="/login"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              登录
            </router-link>
            <router-link 
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              注册
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CaretBottom, User, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const navigationItems = computed(() => {
  const items = [
    { path: '/', name: '首页' },
    { path: '/projects', name: '项目库' }
  ]

  if (userStore.isLoggedIn) {
    if (userStore.currentUser?.role === 'admin') {
      items.push({ path: '/admin', name: '管理后台' })
    } else if (userStore.currentUser?.role === 'company') {
      items.push({ path: '/company', name: '企业中心' })
    }
  }

  return items
})

const isCurrentRoute = (path: string) => {
  return route.path === path
}

const navigateToUserCenter = () => {
  if (userStore.currentUser?.role === 'company') {
    router.push('/company')
  } else {
    router.push('/user')
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    userStore.logout()
    router.push('/login')
  } catch {
    // User canceled
  }
}
</script>