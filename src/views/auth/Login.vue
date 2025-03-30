<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">登录账号</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          还没有账号？
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            立即注册
          </router-link>
        </p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="mt-8 space-y-6"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="电子邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="flex items-center justify-between">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <el-button type="text" class="text-sm">忘记密码？</el-button>
        </div>

        <el-button
          type="primary"
          class="w-full"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <!-- Admin Login Shortcut -->
        <div class="text-center mt-4">
          <el-button type="text" @click="loginAsAdmin">
            管理员登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        userStore.login({
          id: 1,
          username: 'test_user',
          role: 'student',
          email: form.email
        })
        
        const redirectPath = route.query.redirect as string || '/'
        router.push(redirectPath)
      } catch (error) {
        console.error('Login failed:', error)
        ElMessage.error('登录失败，请检查邮箱和密码')
      } finally {
        loading.value = false
      }
    }
  })
}

const loginAsAdmin = async () => {
  loading.value = true
  try {
    // 模拟管理员登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    userStore.login({
      id: 999,
      username: 'admin',
      role: 'admin',
      email: 'admin@example.com'
    })
    
    ElMessage.success('管理员登录成功')
    router.push('/admin')
  } catch (error) {
    console.error('Admin login failed:', error)
    ElMessage.error('管理员登录失败')
  } finally {
    loading.value = false
  }
}
</script>