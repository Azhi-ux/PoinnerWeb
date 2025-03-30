<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6">大学生创业项目推广平台</h1>
          <p class="text-xl mb-8">连接创意与资源，助力学生创业梦想</p>
          <div class="flex justify-center gap-4">
            <el-button type="primary" size="large" @click="$router.push('/projects')">
              浏览项目
            </el-button>
            <el-button type="success" size="large" @click="$router.push('/register')">
              立即注册
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="featured-projects py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">热门项目</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="project in featuredProjects" :key="project.id" 
               class="project-card bg-white rounded-lg shadow-lg overflow-hidden">
            <img :src="project.image" :alt="project.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 mb-4">{{ project.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
                  <el-icon><User /></el-icon>
                  {{ project.author }}
                </span>
                <el-button type="primary" link @click="$router.push(`/projects/${project.id}`)">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="stat-card bg-white p-8 rounded-lg shadow">
            <el-icon class="text-4xl text-blue-600 mb-4"><User /></el-icon>
            <h3 class="text-2xl font-bold mb-2">1000+</h3>
            <p class="text-gray-600">注册用户</p>
          </div>
          <div class="stat-card bg-white p-8 rounded-lg shadow">
            <el-icon class="text-4xl text-green-600 mb-4"><Briefcase /></el-icon>
            <h3 class="text-2xl font-bold mb-2">500+</h3>
            <p class="text-gray-600">创业项目</p>
          </div>
          <div class="stat-card bg-white p-8 rounded-lg shadow">
            <el-icon class="text-4xl text-purple-600 mb-4"><OfficeBuilding /></el-icon>
            <h3 class="text-2xl font-bold mb-2">100+</h3>
            <p class="text-gray-600">合作企业</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Briefcase,OfficeBuilding } from '@element-plus/icons-vue'

const featuredProjects = ref([
  {
    id: 1,
    title: '智能校园导航系统',
    description: '基于AR技术的校园导航解决方案，提供实时导航和信息展示。',
    image: 'https://picsum.photos/seed/1/800/400',
    author: '张三'
  },
  {
    id: 2,
    title: '校园二手书交易平台',
    description: '让闲置教材发挥价值，助力资源循环利用。',
    image: 'https://picsum.photos/seed/2/800/400',
    author: '李四'
  },
  {
    id: 3,
    title: '大学生创业咨询平台',
    description: '提供一站式创业咨询服务，连接专业导师和创业学生。',
    image: 'https://picsum.photos/seed/3/800/400',
    author: '王五'
  }
])
</script>

<style scoped lang="scss">
.hero {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.project-card {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.stat-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}
</style>
