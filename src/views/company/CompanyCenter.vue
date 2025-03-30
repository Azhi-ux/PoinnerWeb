<template>
  <div class="company-center min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <!-- Company Profile Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div class="flex items-center space-x-6">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeLogoUpload"
            >
              <div class="w-24 h-24 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-50">
                <img v-if="companyProfile.logo" :src="companyProfile.logo" class="w-20 h-20 object-contain">
                <el-icon v-else><Plus /></el-icon>
              </div>
            </el-upload>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ companyProfile.name }}</h1>
                  <p class="text-gray-500">{{ companyProfile.industry }} · {{ companyProfile.location }}</p>
                </div>
                <el-button type="primary" @click="showEditProfile = true">编辑资料</el-button>
              </div>
              <div class="flex space-x-8">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ companyProfile.investmentCount }}</p>
                  <p class="text-gray-500">投资项目</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ companyProfile.resourceCount }}</p>
                  <p class="text-gray-500">发布资源</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ companyProfile.followCount }}</p>
                  <p class="text-gray-500">关注项目</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <el-tabs>
          <!-- Investment Projects -->
          <el-tab-pane label="投资项目">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">已投资项目</h2>
                <el-button type="primary" @click="$router.push('/projects')">
                  浏览更多项目
                </el-button>
              </div>
              
              <div class="space-y-6">
                <div v-for="project in investedProjects" :key="project.id" 
                     class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-start space-x-4">
                    <img :src="project.image" :alt="project.title" 
                         class="w-24 h-24 object-cover rounded">
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium">{{ project.title }}</h3>
                        <el-tag :type="project.status.type">{{ project.status.label }}</el-tag>
                      </div>
                      <p class="text-gray-600 mt-2">{{ project.description }}</p>
                      <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                          <span>投资金额：{{ project.investment }}</span>
                          <span>持股比例：{{ project.equity }}%</span>
                        </div>
                        <el-button type="primary" link @click="viewProject(project)">
                          查看详情
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- Resource Management -->
          <el-tab-pane label="资源管理">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">发布的资源</h2>
                <el-button type="primary" @click="showAddResource = true">
                  发布新资源
                </el-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="resource in resources" :key="resource.id" 
                     class="border rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium">{{ resource.title }}</h3>
                      <p class="text-sm text-gray-500 mt-1">
                        发布时间：{{ resource.publishTime }}
                      </p>
                    </div>
                    <el-tag :type="resource.type.type">{{ resource.type.label }}</el-tag>
                  </div>
                  <p class="text-gray-600 mt-3">{{ resource.description }}</p>
                  <div class="flex justify-between items-center mt-4">
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span class="flex items-center">
                        <el-icon class="mr-1"><View /></el-icon>
                        {{ resource.views }}
                      </span>
                      <span class="flex items-center">
                        <el-icon class="mr-1"><Star /></el-icon>
                        {{ resource.favorites }}
                      </span>
                    </div>
                    <div class="flex space-x-2">
                      <el-button type="primary" link @click="editResource(resource)">
                        编辑
                      </el-button>
                      <el-button type="danger" link @click="deleteResource(resource)">
                        删除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- Messages -->
          <el-tab-pane label="消息中心">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <el-tabs>
                <el-tab-pane label="项目咨询">
                  <div class="space-y-4">
                    <div v-for="message in projectMessages" :key="message.id" 
                         class="p-4 border rounded-lg hover:bg-gray-50">
                      <div class="flex items-start space-x-3">
                        <el-avatar :src="message.sender.avatar" :size="40" />
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <span class="font-medium">{{ message.sender.name }}</span>
                            <span class="text-sm text-gray-500">{{ message.time }}</span>
                          </div>
                          <p class="text-gray-600 mt-1">
                            关于项目：<span class="text-blue-600">{{ message.project }}</span>
                          </p>
                          <p class="text-sm text-gray-600 mt-1">{{ message.content }}</p>
                          <div class="mt-2">
                            <el-button type="primary" link size="small" @click="replyMessage(message)">
                              回复
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="系统通知">
                  <div class="space-y-4">
                    <div v-for="notice in systemNotices" :key="notice.id" 
                         class="p-4 border rounded-lg hover:bg-gray-50">
                      <div class="flex items-start justify-between">
                        <div class="flex items-start space-x-3">
                          <el-icon class="text-blue-500" :size="24">
                            <Bell />
                          </el-icon>
                          <div>
                            <p class="font-medium">{{ notice.title }}</p>
                            <p class="text-sm text-gray-600 mt-1">{{ notice.content }}</p>
                          </div>
                        </div>
                        <span class="text-sm text-gray-500">{{ notice.time }}</span>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-tab-pane>

          <!-- Account Settings -->
          <el-tab-pane label="账号设置">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="max-w-2xl">
                <h2 class="text-xl font-bold mb-6">账号安全</h2>
                
                <!-- Change Password -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium mb-4">修改密码</h3>
                  <el-form :model="passwordForm" label-width="100px">
                    <el-form-item label="当前密码">
                      <el-input v-model="passwordForm.currentPassword" type="password" />
                    </el-form-item>
                    <el-form-item label="新密码">
                      <el-input v-model="passwordForm.newPassword" type="password" />
                    </el-form-item>
                    <el-form-item label="确认新密码">
                      <el-input v-model="passwordForm.confirmPassword" type="password" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="changePassword">保存修改</el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <!-- Notification Settings -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium mb-4">通知设置</h3>
                  <el-form :model="notificationSettings">
                    <el-form-item>
                      <el-checkbox v-model="notificationSettings.email">接收邮件通知</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                      <el-checkbox v-model="notificationSettings.system">接收系统通知</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                      <el-checkbox v-model="notificationSettings.message">接收项目咨询通知</el-checkbox>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- Edit Profile Dialog -->
    <el-dialog
      v-model="showEditProfile"
      title="编辑企业资料"
      width="50%"
    >
      <el-form :model="editProfileForm" label-width="100px">
        <el-form-item label="企业名称">
          <el-input v-model="editProfileForm.name" />
        </el-form-item>
        <el-form-item label="所属行业">
          <el-input v-model="editProfileForm.industry" />
        </el-form-item>
        <el-form-item label="企业地址">
          <el-input v-model="editProfileForm.location" />
        </el-form-item>
        <el-form-item label="企业简介">
          <el-input
            v-model="editProfileForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditProfile = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Add Resource Dialog -->
    <el-dialog
      v-model="showAddResource"
      title="发布新资源"
      width="50%"
    >
      <el-form :model="resourceForm" label-width="100px">
        <el-form-item label="资源标题">
          <el-input v-model="resourceForm.title" />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="resourceForm.type" placeholder="选择资源类型" class="w-full">
            <el-option label="投资资金" value="investment" />
            <el-option label="创业指导" value="guidance" />
            <el-option label="场地资源" value="space" />
            <el-option label="其他资源" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述">
          <el-input
            v-model="resourceForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddResource = false">取消</el-button>
          <el-button type="primary" @click="submitResource">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { View, Star, Bell, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const showEditProfile = ref(false)
const showAddResource = ref(false)

// Mock company profile data
const companyProfile = reactive({
  name: '创新科技有限公司',
  logo: 'https://picsum.photos/seed/company1/200',
  industry: '科技创新',
  location: '北京市海淀区',
  investmentCount: 8,
  resourceCount: 12,
  followCount: 25
})

// Mock invested projects data
const investedProjects = ref([
  {
    id: 1,
    title: '智能校园导航系统',
    description: '基于AR技术的校园导航解决方案',
    image: 'https://picsum.photos/seed/project1/200',
    status: { type: 'success', label: '进行中' },
    investment: '￥300,000',
    equity: 15
  },
  {
    id: 2,
    title: '校园二手书交易平台',
    description: '让闲置教材发挥价值',
    image: 'https://picsum.photos/seed/project2/200',
    status: { type: 'warning', label: '筹备中' },
    investment: '￥200,000',
    equity: 10
  }
])

// Mock resources data
const resources = ref([
  {
    id: 1,
    title: '创业启动资金支持计划',
    description: '为优秀的学生创业项目提供最高50万元的启动资金支持',
    type: { type: 'success', label: '投资资金' },
    publishTime: '2024-02-20',
    views: 1200,
    favorites: 45
  },
  {
    id: 2,
    title: '创业导师一对一指导',
    description: '提供经验丰富的创业导师，进行一对一项目指导',
    type: { type: 'warning', label: '创业指导' },
    publishTime: '2024-02-19',
    views: 800,
    favorites: 32
  }
])

// Mock messages data
const projectMessages = ref([
  {
    id: 1,
    sender: {
      name: '张三',
      avatar: 'https://picsum.photos/seed/user1/200'
    },
    project: '智能校园导航系统',
    content: '您好，我想了解更多关于投资条件的细节',
    time: '2024-02-20 09:15'
  },
  {
    id: 2,
    sender: {
      name: '李四',
      avatar: 'https://picsum.photos/seed/user2/200'
    },
    project: '校园二手书交易平台',
    content: '希望能够安排一次线下交流',
    time: '2024-02-19 16:30'
  }
])

// Mock system notices
const systemNotices = ref([
  {
    id: 1,
    title: '平台更新通知',
    content: '企业中心功能优化升级完成',
    time: '2024-02-20 10:30'
  },
  {
    id: 2,
    title: '活动通知',
    content: '下周三将举办创业项目路演活动',
    time: '2024-02-19 15:45'
  }
])

// Forms
const editProfileForm = reactive({
  name: companyProfile.name,
  industry: companyProfile.industry,
  location: companyProfile.location,
  description: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = reactive({
  email: true,
  system: true,
  message: true
})

const resourceForm = reactive({
  title: '',
  type: '',
  description: ''
})

// Methods
const beforeLogoUpload = (file: File) => {
  ElMessage.success('企业logo上传成功')
  return false
}

const saveProfile = () => {
  Object.assign(companyProfile, {
    name: editProfileForm.name,
    industry: editProfileForm.industry,
    location: editProfileForm.location
  })
  showEditProfile.value = false
  ElMessage.success('企业资料更新成功')
}

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const viewProject = (project: any) => {
  router.push(`/projects/${project.id}`)
}

const editResource = (resource: any) => {
  resourceForm.title = resource.title
  resourceForm.type = resource.type.value
  resourceForm.description = resource.description
  showAddResource.value = true
}

const deleteResource = async (resource: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该资源吗？', '提示', {
      type: 'warning'
    })
    const index = resources.value.findIndex(r => r.id === resource.id)
    if (index > -1) {
      resources.value.splice(index, 1)
    }
    ElMessage.success('资源删除成功')
  } catch {
    // User canceled
  }
}

const submitResource = () => {
  if (!resourceForm.title || !resourceForm.type || !resourceForm.description) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // 模拟添加资源
  const newResource = {
    id: Date.now(),
    title: resourceForm.title,
    description: resourceForm.description,
    type: {
      type: 'success',
      label: resourceForm.type === 'investment' ? '投资资金' :
             resourceForm.type === 'guidance' ? '创业指导' :
             resourceForm.type === 'space' ? '场地资源' : '其他资源'
    },
    publishTime: new Date().toLocaleDateString(),
    views: 0,
    favorites: 0
  }

  resources.value.unshift(newResource)
  showAddResource.value = false
  ElMessage.success('资源发布成功')

  // Reset form
  resourceForm.title = ''
  resourceForm.type = ''
  resourceForm.description = ''
}

const replyMessage = (message: any) => {
  ElMessage.success('回复成功')
}
</script>

<style scoped>
.avatar-uploader {
  display: inline-block;
}

.avatar-uploader:hover {
  cursor: pointer;
}
</style>