<template>
  <div class="about-page py-16">
    <div class="container mx-auto px-4">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">关于我们</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          大学生创业项目推广平台致力于帮助大学生实现创业梦想，
          为创新创业提供全方位支持。
        </p>
      </div>

      <!-- Mission & Vision -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <el-icon class="text-blue-600" :size="32"><Aim /></el-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">我们的使命</h2>
          <p class="text-gray-600">
            通过搭建创业项目与投资资源的桥梁，培育创新人才，
            推动大学生创业项目的孵化与发展，为社会创造更多价值。
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <el-icon class="text-green-600" :size="32"><View /></el-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">我们的愿景</h2>
          <p class="text-gray-600">
            成为中国最具影响力的大学生创业服务平台，
            助力更多优秀创业项目成长，推动创新创业生态系统的建设。
          </p>
        </div>
      </div>

      <!-- Core Values -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-12">核心价值观</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <el-icon class="text-purple-600" :size="32"><Star /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">创新</h3>
            <p class="text-gray-600">鼓励创新思维，支持创新项目</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <el-icon class="text-blue-600" :size="32"><Connection /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">协作</h3>
            <p class="text-gray-600">促进资源共享，加强合作共赢</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <el-icon class="text-green-600" :size="32"><CircleCheck /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">诚信</h3>
            <p class="text-gray-600">坚持诚信经营，保护各方利益</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <el-icon class="text-red-600" :size="32"><Promotion /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">成长</h3>
            <p class="text-gray-600">注重持续发展，追求卓越品质</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-12">我们的团队</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="member in teamMembers" :key="member.id" 
               class="bg-white rounded-lg shadow-lg p-6 text-center">
            <img :src="member.avatar" :alt="member.name" 
                 class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ member.name }}</h3>
            <p class="text-gray-600 mb-2">{{ member.position }}</p>
            <p class="text-sm text-gray-500">{{ member.description }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center mb-8">联系我们</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">联系方式</h3>
            <ul class="space-y-4">
              <li class="flex items-center">
                <el-icon class="mr-4 text-blue-600"><Location /></el-icon>
                <span>北京市海淀区中关村大街1号</span>
              </li>
              <li class="flex items-center">
                <el-icon class="mr-4 text-blue-600"><Message /></el-icon>
                <span>contact@example.com</span>
              </li>
              <li class="flex items-center">
                <el-icon class="mr-4 text-blue-600"><Phone /></el-icon>
                <span>400-123-4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">留言咨询</h3>
            <el-form :model="contactForm">
              <el-form-item>
                <el-input v-model="contactForm.name" placeholder="您的姓名" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="contactForm.email" placeholder="电子邮箱" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="contactForm.message"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您的留言"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitContact">提交留言</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Aim, View, Star, Connection, CircleCheck,
  Promotion, Location, Message, Phone
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const teamMembers = [
  {
    id: 1,
    name: '张明',
    position: '创始人 & CEO',
    avatar: 'https://picsum.photos/seed/ceo/200',
    description: '拥有10年创业经验，致力于推动创新创业发展'
  },
  {
    id: 2,
    name: '李华',
    position: '技术总监',
    avatar: 'https://picsum.photos/seed/cto/200',
    description: '前阿里巴巴技术专家，擅长平台架构设计'
  },
  {
    id: 3,
    name: '王芳',
    position: '运营总监',
    avatar: 'https://picsum.photos/seed/coo/200',
    description: '具有丰富的创业项目孵化和运营经验'
  }
]

const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

const submitContact = () => {
  if (!contactForm.name || !contactForm.email || !contactForm.message) {
    ElMessage.warning('请填写完整信息')
    return
  }

  ElMessage.success('留言提交成功，我们会尽快回复您！')
  contactForm.name = ''
  contactForm.email = ''
  contactForm.message = ''
}
</script>