<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">关于我们</h3>
          <p class="text-gray-400">
            大学生创业项目推广平台致力于帮助大学生实现创业梦想，
            连接优质项目与投资资源。
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">快速链接</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
                首页
              </router-link>
            </li>
            <li>
              <router-link to="/projects" class="text-gray-400 hover:text-white transition-colors">
                项目库
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-gray-400 hover:text-white transition-colors">
                关于我们
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-400 hover:text-white transition-colors">
                联系我们
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">联系方式</h3>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <el-icon class="mr-2"><Location /></el-icon>
              北京市海淀区中关村大街1号
            </li>
            <li class="flex items-center">
              <el-icon class="mr-2"><Message /></el-icon>
              contact@example.com
            </li>
            <li class="flex items-center">
              <el-icon class="mr-2"><Phone /></el-icon>
              400-123-4567
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-4">订阅通讯</h3>
          <p class="text-gray-400 mb-4">
            订阅我们的通讯，获取最新创业资讯和项目信息。
          </p>
          <div class="flex">
            <el-input
              v-model="email"
              placeholder="输入您的邮箱"
              class="flex-1 mr-2"
            />
            <el-button type="primary" @click="subscribe">
              订阅
            </el-button>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} 大学生创业项目推广平台. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Location, Message, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const email = ref('')

const subscribe = () => {
  if (!email.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  
  ElMessage.success('订阅成功！')
  email.value = ''
}
</script>