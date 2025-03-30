<template>
  <div class="user-center min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <!-- User Profile Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div class="flex items-center space-x-6">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <el-avatar
                :size="100"
                :src="userProfile.avatar"
                class="cursor-pointer hover:opacity-80"
              />
            </el-upload>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ userProfile.name }}</h1>
                  <p class="text-gray-500">{{ userProfile.university }} · {{ userProfile.major }}</p>
                </div>
                <el-button type="primary" @click="showEditProfile = true">编辑资料</el-button>
              </div>
              <div class="flex space-x-8">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ userProfile.projectCount }}</p>
                  <p class="text-gray-500">创建的项目</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ userProfile.followCount }}</p>
                  <p class="text-gray-500">关注的项目</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ userProfile.likeCount }}</p>
                  <p class="text-gray-500">获得的点赞</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <el-tabs>
          <!-- My Projects -->
          <el-tab-pane label="我的项目">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">我创建的项目</h2>
                <el-button type="primary" @click="$router.push('/projects/create')">
                  创建新项目
                </el-button>
              </div>
              
              <div class="space-y-6">
                <div v-for="project in myProjects" :key="project.id" 
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
                          <span class="flex items-center">
                            <el-icon class="mr-1"><View /></el-icon>
                            {{ project.views }}
                          </span>
                          <span class="flex items-center">
                            <el-icon class="mr-1"><Star /></el-icon>
                            {{ project.favorites }}
                          </span>
                          <span class="flex items-center">
                            <el-icon class="mr-1"><Message /></el-icon>
                            {{ project.comments }}
                          </span>
                        </div>
                        <div class="flex space-x-2">
                          <el-button type="primary" link @click="editProject(project)">
                            编辑
                          </el-button>
                          <el-button type="danger" link @click="deleteProject(project)">
                            删除
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- Followed Projects -->
          <el-tab-pane label="关注的项目">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="project in followedProjects" :key="project.id" 
                     class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-start space-x-4">
                    <img :src="project.image" :alt="project.title" 
                         class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium">{{ project.title }}</h3>
                      <p class="text-sm text-gray-600 mt-2">{{ project.description }}</p>
                      <div class="flex justify-between items-center mt-4">
                        <span class="text-sm text-gray-500">
                          {{ project.author }}
                        </span>
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

          <!-- Messages -->
          <el-tab-pane label="消息通知">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <el-tabs>
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

                <el-tab-pane label="项目消息">
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
              </el-tabs>
            </div>
          </el-tab-pane>

          <!-- Account Settings -->
          <el-tab-pane label="账号设置">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="max-w-2xl">
                <h2 class="text-xl font-bold mb-6">安全设置</h2>
                
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
                      <el-checkbox v-model="notificationSettings.message">接收私信通知</el-checkbox>
                    </el-form-item>
                  </el-form>
                </div>

                <!-- Account Deletion -->
                <div>
                  <h3 class="text-lg font-medium text-red-600 mb-4">账号注销</h3>
                  <p class="text-gray-600 mb-4">
                    注销账号后，您的所有数据将被永久删除，此操作不可逆。
                  </p>
                  <el-button type="danger" @click="showDeleteAccount = true">
                    注销账号
                  </el-button>
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
      title="编辑个人资料"
      width="50%"
    >
      <el-form :model="editProfileForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="editProfileForm.name" />
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="editProfileForm.university" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="editProfileForm.major" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="editProfileForm.bio"
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

    <!-- Delete Account Dialog -->
    <el-dialog
      v-model="showDeleteAccount"
      title="确认注销账号"
      width="30%"
    >
      <div class="text-red-600">
        <p>请确认您要注销账号：</p>
        <ul class="list-disc list-inside mt-4">
          <li>所有个人数据将被删除</li>
          <li>创建的项目将被移除</li>
          <li>此操作不可撤销</li>
        </ul>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteAccount = false">取消</el-button>
          <el-button type="danger" @click="deleteAccount">确认注销</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { View, Star, Message, Bell } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const showEditProfile = ref(false)
const showDeleteAccount = ref(false)

// Mock user profile data
const userProfile = reactive({
  name: '张三',
  avatar: 'https://picsum.photos/seed/user1/200',
  university: '清华大学',
  major: '计算机科学与技术',
  projectCount: 5,
  followCount: 12,
  likeCount: 45
})

// Mock projects data
const myProjects = ref([
  {
    id: 1,
    title: '智能校园导航系统',
    description: '基于AR技术的校园导航解决方案',
    image: 'https://picsum.photos/seed/project1/200',
    status: { type: 'success', label: '进行中' },
    views: 1200,
    favorites: 45,
    comments: 23
  },
  {
    id: 2,
    title: '校园二手书交易平台',
    description: '让闲置教材发挥价值',
    image: 'https://picsum.photos/seed/project2/200',
    status: { type: 'warning', label: '审核中' },
    views: 800,
    favorites: 32,
    comments: 15
  }
])

const followedProjects = ref([
  {
    id: 3,
    title: '大学生创业咨询平台',
    description: '提供一站式创业咨询服务',
    image: 'https://picsum.photos/seed/project3/200',
    author: '李四'
  },
  {
    id: 4,
    title: '校园快递代取系统',
    description: '解决校园快递最后一公里问题',
    image: 'https://picsum.photos/seed/project4/200',
    author: '王五'
  }
])

// Mock notifications data
const systemNotices = ref([
  {
    id: 1,
    title: '系统升级通知',
    content: '系统将于今晚22:00进行升级维护',
    time: '2024-02-20 10:30'
  },
  {
    id: 2,
    title: '活动通知',
    content: '创业项目路演活动即将开始',
    time: '2024-02-19 15:45'
  }
])

const projectMessages = ref([
  {
    id: 1,
    sender: {
      name: '李四',
      avatar: 'https://picsum.photos/seed/user2/200'
    },
    content: '您的项目很有意思，希望能够进一步交流',
    time: '2024-02-20 09:15'
  },
  {
    id: 2,
    sender: {
      name: '王五',
      avatar: 'https://picsum.photos/seed/user3/200'
    },
    content: '关于项目融资方面，我们可以详细讨论',
    time: '2024-02-19 16:30'
  }
])

// Forms
const editProfileForm = reactive({
  name: userProfile.name,
  university: userProfile.university,
  major: userProfile.major,
  bio: ''
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

// Methods
const beforeAvatarUpload = (file: File) => {
  // 处理头像上传
  ElMessage.success('头像上传成功')
  return false
}

const saveProfile = () => {
  Object.assign(userProfile, {
    name: editProfileForm.name,
    university: editProfileForm.university,
    major: editProfileForm.major
  })
  showEditProfile.value = false
  ElMessage.success('个人资料更新成功')
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

const editProject = (project: any) => {
  router.push(`/projects/${project.id}/edit`)
}

const deleteProject = async (project: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      type: 'warning'
    })
    const index = myProjects.value.findIndex(p => p.id === project.id)
    if (index > -1) {
      myProjects.value.splice(index, 1)
    }
    ElMessage.success('项目删除成功')
  } catch {
    // User canceled
  }
}

const viewProject = (project: any) => {
  router.push(`/projects/${project.id}`)
}

const replyMessage = (message: any) => {
  // 实现回复消息的逻辑
  ElMessage.success('回复成功')
}

const deleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '请输入"DELETE"确认注销账号',
      '警告',
      {
        confirmButtonText: '确认注销',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /^DELETE$/,
        inputErrorMessage: '请输入"DELETE"确认'
      }
    )
    ElMessage.success('账号已注销')
    router.push('/login')
  } catch {
    // User canceled
  }
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