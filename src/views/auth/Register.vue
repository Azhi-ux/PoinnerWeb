<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">注册账号</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          已有账号？
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            立即登录
          </router-link>
        </p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="mt-8 space-y-6"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>

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

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="role">
          <el-select v-model="form.role" placeholder="选择角色" class="w-full">
            <el-option label="学生" value="student" />
            <el-option label="企业" value="company" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.agreement">
            我已阅读并同意
            <el-button type="text" class="p-0" @click="showAgreement = true">
              用户协议
            </el-button>
          </el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          class="w-full"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>
      </el-form>
    </div>

    <!-- Agreement Dialog -->
    <el-dialog
      v-model="showAgreement"
      title="用户协议"
      width="50%"
    >
      <div class="text-sm text-gray-600">
        <h3 class="font-bold mb-4">服务条款</h3>
        <p class="mb-4">欢迎使用大学生创业项目推广平台！</p>
        <p class="mb-4">本协议是您与平台之间关于使用平台服务所订立的协议。</p>
        <!-- Add more agreement content -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAgreement = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Message, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const showAgreement = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  agreement: false
})

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', validator: validatePass2 }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  if (!form.agreement) {
    ElMessage.warning('请阅读并同意用户协议')
    return
  }
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        userStore.login({
          id: 1,
          username: form.username,
          role: form.role as 'student' | 'company' | 'admin',
          email: form.email
        })
        
        ElMessage.success('注册成功！')
        router.push('/')
      } catch (error) {
        console.error('Registration failed:', error)
        ElMessage.error('注册失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>