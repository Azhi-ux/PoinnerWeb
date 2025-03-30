<template>
  <div class="project-detail container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Project Header -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <img :src="project.coverImage" :alt="project.title" class="w-full h-64 object-cover">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold text-gray-900">{{ project.title }}</h1>
            <el-tag :type="project.status.type" size="large">{{ project.status.label }}</el-tag>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span class="flex items-center">
              <el-icon class="mr-1"><Calendar /></el-icon>
              {{ project.createdAt }}
            </span>
            <span class="flex items-center">
              <el-icon class="mr-1"><View /></el-icon>
              {{ project.views }} 次浏览
            </span>
            <span class="flex items-center">
              <el-icon class="mr-1"><Star /></el-icon>
              {{ project.favorites }} 收藏
            </span>
          </div>
          <p class="text-gray-600 text-lg mb-6">{{ project.description }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <el-avatar :src="project.author.avatar" />
              <div>
                <p class="font-medium text-gray-900">{{ project.author.name }}</p>
                <p class="text-sm text-gray-500">{{ project.author.university }}</p>
              </div>
            </div>
            <div class="flex space-x-4">
              <el-button type="primary" :icon="Star" @click="toggleFavorite">
                {{ project.isFavorited ? '已收藏' : '收藏' }}
              </el-button>
              <el-button type="success" @click="showContactDialog = true">联系创始人</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Content -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <el-tabs>
          <el-tab-pane label="项目详情">
            <div class="prose max-w-none">
              <h2 class="text-xl font-bold mb-4">项目背景</h2>
              <p class="mb-6">{{ project.background }}</p>
              
              <h2 class="text-xl font-bold mb-4">解决方案</h2>
              <p class="mb-6">{{ project.solution }}</p>

              <h2 class="text-xl font-bold mb-4">市场分析</h2>
              <p class="mb-6">{{ project.marketAnalysis }}</p>

              <h2 class="text-xl font-bold mb-4">团队介绍</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="member in project.team" :key="member.id" 
                     class="flex items-start space-x-4">
                  <el-avatar :src="member.avatar" :size="60" />
                  <div>
                    <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
                    <p class="text-gray-500">{{ member.role }}</p>
                    <p class="text-sm text-gray-600">{{ member.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="融资需求">
            <div class="space-y-6">
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="text-lg font-medium mb-2">融资金额</h3>
                <p class="text-3xl font-bold text-blue-600">{{ project.funding.amount }}</p>
                <p class="text-gray-500">计划融资比例：{{ project.funding.equity }}%</p>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-4">资金用途</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(usage, index) in project.funding.usage"
                    :key="index"
                    :type="usage.type"
                  >
                    <h4 class="font-medium">{{ usage.title }}</h4>
                    <p class="text-gray-600">{{ usage.description }}</p>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="评论讨论">
            <!-- Comment Form -->
            <div class="mb-6">
              <el-input
                v-model="newComment"
                type="textarea"
                :rows="3"
                placeholder="写下你的评论..."
              />
              <div class="mt-2 flex justify-end">
                <el-button type="primary" @click="submitComment">发表评论</el-button>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-6">
              <div v-for="comment in project.comments" :key="comment.id" 
                   class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <el-avatar :src="comment.user.avatar" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-medium text-gray-900">{{ comment.user.name }}</span>
                      <span class="text-sm text-gray-500">{{ comment.createdAt }}</span>
                    </div>
                    <p class="mt-2 text-gray-600">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- Contact Dialog -->
    <el-dialog
      v-model="showContactDialog"
      title="联系创始人"
      width="30%"
    >
      <el-form :model="contactForm">
        <el-form-item label="联系方式">
          <el-input v-model="contactForm.contact" placeholder="请输入您的联系方式" />
        </el-form-item>
        <el-form-item label="留言内容">
          <el-input
            v-model="contactForm.message"
            type="textarea"
            :rows="4"
            placeholder="请输入留言内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showContactDialog = false">取消</el-button>
          <el-button type="primary" @click="submitContact">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, View, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const showContactDialog = ref(false)
const newComment = ref('')

const contactForm = reactive({
  contact: '',
  message: ''
})

// 模拟项目数据
const project = reactive({
  id: route.params.id,
  title: '智能校园导航系统',
  status: { type: 'success', label: '融资中' },
  coverImage: 'https://picsum.photos/seed/1/1200/400',
  description: '基于AR技术的校园导航解决方案，提供实时导航和信息展示，帮助新生和访客快速熟悉校园环境。',
  createdAt: '2024-02-20',
  views: 1580,
  favorites: 45,
  isFavorited: false,
  author: {
    name: '张三',
    avatar: 'https://picsum.photos/seed/user1/100',
    university: '清华大学'
  },
  background: '随着高校规模不断扩大，新生和访客经常面临找不到目的地的困扰。传统的地图和指示牌无法提供足够直观和实时的导航信息。',
  solution: '我们开发了基于AR技术的校园导航系统，通过手机摄像头实时识别周围环境，叠加虚拟导航信息，为用户提供沉浸式的导航体验。',
  marketAnalysis: '目前国内高校数量众多，每年新生规模庞大，且校园参观访客络绎不绝。我们的解决方案可以帮助学校提升服务质量，改善用户体验。',
  team: [
    {
      id: 1,
      name: '张三',
      role: '项目负责人',
      avatar: 'https://picsum.photos/seed/member1/100',
      description: '计算机科学专业，有丰富的AR开发经验'
    },
    {
      id: 2,
      name: '李四',
      role: '技术主管',
      avatar: 'https://picsum.photos/seed/member2/100',
      description: '软件工程专业，专注于移动应用开发'
    }
  ],
  funding: {
    amount: '￥500,000',
    equity: 20,
    usage: [
      {
        type: 'primary',
        title: '技术研发',
        description: '优化AR算法，提升识别准确率'
      },
      {
        type: 'success',
        title: '市场推广',
        description: '开展校园推广活动，扩大用户基础'
      },
      {
        type: 'warning',
        title: '团队扩充',
        description: '招募开发和运营人员'
      }
    ]
  },
  comments: [
    {
      id: 1,
      user: {
        name: '王五',
        avatar: 'https://picsum.photos/seed/user2/100'
      },
      content: '这个项目很有意思，解决了实际问题',
      createdAt: '2024-02-19 14:30'
    },
    {
      id: 2,
      user: {
        name: '赵六',
        avatar: 'https://picsum.photos/seed/user3/100'
      },
      content: '希望能尽快在我们学校使用上',
      createdAt: '2024-02-18 16:45'
    }
  ]
})

const toggleFavorite = () => {
  project.isFavorited = !project.isFavorited
  project.favorites += project.isFavorited ? 1 : -1
  ElMessage.success(project.isFavorited ? '收藏成功' : '已取消收藏')
}

const submitComment = () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  project.comments.unshift({
    id: Date.now(),
    user: {
      name: '当前用户',
      avatar: 'https://picsum.photos/seed/currentUser/100'
    },
    content: newComment.value,
    createdAt: new Date().toLocaleString()
  })

  newComment.value = ''
  ElMessage.success('评论发布成功')
}

const submitContact = () => {
  if (!contactForm.contact || !contactForm.message) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // 模拟发送消息
  setTimeout(() => {
    ElMessage.success('消息已发送')
    showContactDialog.value = false
    contactForm.contact = ''
    contactForm.message = ''
  }, 1000)
}
</script>

<style scoped>
.project-detail {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>