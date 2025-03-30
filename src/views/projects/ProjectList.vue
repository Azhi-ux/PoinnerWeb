<template>
  <div class="project-list container mx-auto px-4 py-8">
    <!-- Search and Filter Section -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="search-box flex-grow max-w-md">
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目"
            :prefix-icon="Search"
            clearable
          />
        </div>
        <div class="filters flex gap-4">
          <el-select v-model="selectedCategory" placeholder="项目分类">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          <el-select v-model="sortBy" placeholder="排序方式">
            <el-option label="最新发布" value="newest" />
            <el-option label="最多点赞" value="mostLiked" />
            <el-option label="最多收藏" value="mostFavorited" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="project in filteredProjects" :key="project.id" 
           class="project-card bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative">
          <img :src="project.image" :alt="project.title" class="w-full h-48 object-cover">
          <div class="absolute top-4 right-4">
            <el-button
              circle
              :icon="project.isFavorited ? Star : StarFilled"
              @click="toggleFavorite(project)"
            />
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">{{ project.title }}</h3>
            <el-tag :type="project.category.type">{{ project.category.label }}</el-tag>
          </div>
          <p class="text-gray-600 mb-4">{{ project.description }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="flex items-center text-sm text-gray-500">
                <el-icon class="mr-1"><View /></el-icon>
                {{ project.views }}
              </span>
              <span class="flex items-center text-sm text-gray-500">
                <el-icon class="mr-1"><Star /></el-icon>
                {{ project.favorites }}
              </span>
              <span class="flex items-center text-sm text-gray-500">
                <el-icon class="mr-1"><ThumbsUp /></el-icon>
                {{ project.likes }}
              </span>
            </div>
            <el-button type="primary" @click="viewProject(project.id)">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Star, StarFilled, View, ThumbsUp } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

const categories = [
  { value: 'tech', label: '科技创新', type: 'primary' },
  { value: 'service', label: '生活服务', type: 'success' },
  { value: 'education', label: '教育培训', type: 'warning' },
  { value: 'culture', label: '文化创意', type: 'info' },
  { value: 'other', label: '其他', type: 'info' }
]

const projects = ref([
  {
    id: 1,
    title: '智能校园导航系统',
    description: '基于AR技术的校园导航解决方案，提供实时导航和信息展示。',
    image: 'https://picsum.photos/seed/1/800/400',
    category: { value: 'tech', label: '科技创新', type: 'primary' },
    views: 1200,
    favorites: 45,
    likes: 89,
    isFavorited: false
  },
  {
    id: 2,
    title: '校园二手书交易平台',
    description: '让闲置教材发挥价值，助力资源循环利用。',
    image: 'https://picsum.photos/seed/2/800/400',
    category: { value: 'service', label: '生活服务', type: 'success' },
    views: 800,
    favorites: 32,
    likes: 67,
    isFavorited: true
  },
  // Add more mock projects...
])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    if (searchQuery.value && !project.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    if (selectedCategory.value && project.category.value !== selectedCategory.value) {
      return false
    }
    return true
  })
})

const toggleFavorite = (project: any) => {
  project.isFavorited = !project.isFavorited
  project.favorites += project.isFavorited ? 1 : -1
}

const viewProject = (id: number) => {
  router.push(`/projects/${id}`)
}
</script>

<style scoped lang="scss">
.project-card {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}
</style>