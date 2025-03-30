<template>
  <div class="admin-dashboard min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500">总用户数</p>
                <h3 class="text-3xl font-bold text-gray-900">2,847</h3>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <el-icon class="text-blue-600" :size="24"><User /></el-icon>
              </div>
            </div>
            <p class="text-green-600 text-sm mt-4">
              <span class="font-medium">+12%</span> 较上月
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500">项目数量</p>
                <h3 class="text-3xl font-bold text-gray-900">486</h3>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <el-icon class="text-green-600" :size="24"><Briefcase /></el-icon>
              </div>
            </div>
            <p class="text-green-600 text-sm mt-4">
              <span class="font-medium">+8%</span> 较上月
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500">企业数量</p>
                <h3 class="text-3xl font-bold text-gray-900">124</h3>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <el-icon class="text-purple-600" :size="24"><OfficeBuilding /></el-icon>
              </div>
            </div>
            <p class="text-green-600 text-sm mt-4">
              <span class="font-medium">+15%</span> 较上月
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500">总投资额</p>
                <h3 class="text-3xl font-bold text-gray-900">¥2.4M</h3>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <el-icon class="text-yellow-600" :size="24"><Money /></el-icon>
              </div>
            </div>
            <p class="text-green-600 text-sm mt-4">
              <span class="font-medium">+20%</span> 较上月
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Section -->
          <div class="lg:col-span-2 space-y-8">
            <!-- User Management -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">用户管理</h2>
                <div class="flex space-x-4">
                  <el-input
                    v-model="searchQuery"
                    placeholder="搜索用户"
                    :prefix-icon="Search"
                    clearable
                  />
                  <el-select v-model="userType" placeholder="用户类型" class="w-32">
                    <el-option label="全部用户" value="" />
                    <el-option label="学生" value="student" />
                    <el-option label="企业" value="company" />
                  </el-select>
                </div>
              </div>

              <el-table :data="filteredUsers" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="用户名" width="120">
                  <template #default="{ row }">
                    <div class="flex items-center space-x-2">
                      <el-avatar :size="32" :src="row.avatar" />
                      <span>{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="role" label="角色" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.role === 'student' ? 'success' : 'warning'">
                      {{ row.role === 'student' ? '学生' : '企业' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.status"
                      :active-value="true"
                      :inactive-value="false"
                      @change="toggleUserStatus(row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="editUser(row)">编辑</el-button>
                    <el-button type="danger" link @click="deleteUser(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="flex justify-center mt-6">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                />
              </div>
            </div>

            <!-- Project Management -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">项目管理</h2>
                <el-button type="primary" @click="showProjectAudit = true">
                  审核项目
                </el-button>
              </div>

              <el-tabs>
                <el-tab-pane label="待审核">
                  <el-table :data="pendingProjects">
                    <el-table-column prop="title" label="项目名称" />
                    <el-table-column prop="creator" label="创建者" />
                    <el-table-column prop="submitTime" label="提交时间" />
                    <el-table-column label="操作" width="200">
                      <template #default="{ row }">
                        <el-button type="success" size="small" @click="approveProject(row)">
                          通过
                        </el-button>
                        <el-button type="danger" size="small" @click="rejectProject(row)">
                          拒绝
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>

                <el-tab-pane label="已审核">
                  <el-table :data="approvedProjects">
                    <el-table-column prop="title" label="项目名称" />
                    <el-table-column prop="creator" label="创建者" />
                    <el-table-column prop="status" label="状态">
                      <template #default="{ row }">
                        <el-tag :type="row.status === 'approved' ? 'success' : 'danger'">
                          {{ row.status === 'approved' ? '已通过' : '已拒绝' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="auditTime" label="审核时间" />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>

          <!-- Right Section -->
          <div class="lg:col-span-1 space-y-8">
            <!-- System Status -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">系统状态</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">CPU使用率</span>
                    <span class="font-medium">45%</span>
                  </div>
                  <el-progress :percentage="45" />
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">内存使用率</span>
                    <span class="font-medium">62%</span>
                  </div>
                  <el-progress :percentage="62" type="warning" />
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">存储空间</span>
                    <span class="font-medium">28%</span>
                  </div>
                  <el-progress :percentage="28" type="success" />
                </div>
              </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">最近活动</h2>
              <div class="space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id" 
                     class="flex items-start space-x-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                       :class="activity.iconBg">
                    <el-icon :class="activity.iconColor" :size="16">
                      <component :is="activity.icon" />
                    </el-icon>
                  </div>
                  <div>
                    <p class="text-sm">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">快捷操作</h2>
              <div class="space-y-4">
                <el-button type="primary" class="w-full" @click="showSystemSettings = true">
                  系统设置
                </el-button>
                <el-button type="warning" class="w-full" @click="showBackupDialog = true">
                  数据备份
                </el-button>
                <el-button type="info" class="w-full" @click="generateReport">
                  生成报表
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Dialog -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑用户信息"
      width="500px"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" class="w-full">
            <el-option label="学生" value="student" />
            <el-option label="企业" value="company" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editForm.status"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- System Settings Dialog -->
    <el-dialog
      v-model="showSystemSettings"
      title="系统设置"
      width="600px"
    >
      <el-tabs>
        <el-tab-pane label="基本设置">
          <el-form label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="systemSettings.name" />
            </el-form-item>
            <el-form-item label="网站标题">
              <el-input v-model="systemSettings.title" />
            </el-form-item>
            <el-form-item label="Logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="systemSettings.logo" :src="systemSettings.logo" class="w-20 h-20">
                <el-icon v-else><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="安全设置">
          <el-form label-width="120px">
            <el-form-item label="密码策略">
              <el-checkbox-group v-model="systemSettings.passwordPolicy">
                <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                <el-checkbox label="numbers">必须包含数字</el-checkbox>
                <el-checkbox label="special">必须包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录尝试次数">
              <el-input-number v-model="systemSettings.loginAttempts" :min="3" :max="10" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="邮件设置">
          <el-form label-width="120px">
            <el-form-item label="SMTP服务器">
              <el-input v-model="systemSettings.smtp.host" />
            </el-form-item>
            <el-form-item label="端口">
              <el-input v-model="systemSettings.smtp.port" />
            </el-form-item>
            <el-form-item label="发件邮箱">
              <el-input v-model="systemSettings.smtp.email" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSystemSettings = false">取消</el-button>
          <el-button type="primary" @click="saveSystemSettings">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Backup Dialog -->
    <el-dialog
      v-model="showBackupDialog"
      title="数据备份"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="备份内容">
          <el-checkbox-group v-model="backupSettings.content">
            <el-checkbox label="users">用户数据</el-checkbox>
            <el-checkbox label="projects">项目数据</el-checkbox>
            <el-checkbox label="system">系统配置</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备份方式">
          <el-radio-group v-model="backupSettings.type">
            <el-radio label="full">完整备份</el-radio>
            <el-radio label="incremental">增量备份</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBackupDialog = false">取消</el-button>
          <el-button type="primary" @click="startBackup">开始备份</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  User, Briefcase, OfficeBuilding, Money, Search,
  CircleCheck, CircleClose, Edit, Delete, Plus
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Search and filter
const searchQuery = ref('')
const userType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// Dialogs visibility
const showEditDialog = ref(false)
const showSystemSettings = ref(false)
const showBackupDialog = ref(false)
const showProjectAudit = ref(false)

// Forms
const editForm = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  status: true
})

const systemSettings = reactive({
  name: '大学生创业项目推广平台',
  title: '创业梦工厂',
  logo: '',
  passwordPolicy: ['uppercase', 'numbers'],
  loginAttempts: 5,
  smtp: {
    host: 'smtp.example.com',
    port: '587',
    email: 'noreply@example.com'
  }
})

const backupSettings = reactive({
  content: ['users', 'projects'],
  type: 'full'
})

// Mock data
const users = ref([
  {
    id: '001',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'student',
    status: true,
    avatar: 'https://picsum.photos/seed/user1/100'
  },
  {
    id: '002',
    name: '李四',
    email: 'lisi@example.com',
    role: 'company',
    status: true,
    avatar: 'https://picsum.photos/seed/user2/100'
  },
  {
    id: '003',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'student',
    status: false,
    avatar: 'https://picsum.photos/seed/user3/100'
  }
])

const pendingProjects = ref([
  {
    id: 1,
    title: '智能校园导航系统',
    creator: '张三',
    submitTime: '2024-02-20 10:30'
  },
  {
    id: 2,
    title: '校园二手书交易平台',
    creator: '李四',
    submitTime: '2024-02-20 09:15'
  }
])

const approvedProjects = ref([
  {
    id: 3,
    title: '大学生创业咨询平台',
    creator: '王五',
    status: 'approved',
    auditTime: '2024-02-19 15:30'
  },
  {
    id: 4,
    title: '校园快递代取系统',
    creator: '赵六',
    status: 'rejected',
    auditTime: '2024-02-19 14:20'
  }
])

const recentActivities = ref([
  {
    id: 1,
    icon: 'CircleCheck',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    description: '新用户注册: 李四 (企业用户)',
    time: '10分钟前'
  },
  {
    id: 2,
    icon: 'Edit',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: '项目更新: 智能校园导航系统',
    time: '30分钟前'
  },
  {
    id: 3,
    icon: 'CircleClose',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    description: '用户注销: 张三',
    time: '1小时前'
  }
])

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !userType.value || user.role === userType.value
    return matchesSearch && matchesType
  })
})

// Methods
const toggleUserStatus = (user: any) => {
  ElMessage.success(`用户 ${user.name} 状态已${user.status ? '启用' : '禁用'}`)
}

const editUser = (user: any) => {
  editForm.value = { ...user }
  showEditDialog.value = true
}

const deleteUser = async (user: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${user.name} 吗？`, '警告', {
      type: 'warning'
    })
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
    ElMessage.success('用户删除成功')
  } catch {
    // User canceled
  }
}

const saveUser = () => {
  const index = users.value.findIndex(u => u.id === editForm.value.id)
  if (index > -1) {
    users.value[index] = { ...editForm.value }
  }
  showEditDialog.value = false
  ElMessage.success('用户信息更新成功')
}

const beforeLogoUpload = (file: File) => {
  ElMessage.success('Logo上传成功')
  return false
}

const saveSystemSettings = () => {
  ElMessage.success('系统设置保存成功')
  showSystemSettings.value = false
}

const startBackup = () => {
  ElMessage.success('数据备份已开始，请稍候...')
  showBackupDialog.value = false
}

const generateReport = () => {
  ElMessage.success('报表生成中，稍后将发送到您的邮箱')
}

const approveProject = (project: any) => {
  ElMessage.success(`项目 "${project.title}" 已审核通过`)
  moveProjectToApproved(project, 'approved')
}

const rejectProject = async (project: any) => {
  try {
    await ElMessageBox.prompt('请输入拒绝原因', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea'
    })
    
    ElMessage.success(`项目 "${project.title}" 已被拒绝`)
    moveProjectToApproved(project, 'rejected')
  } catch {
    // User canceled
  }
}

const moveProjectToApproved = (project: any, status: 'approved' | 'rejected') => {
  const index = pendingProjects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    pendingProjects.value.splice(index, 1)
    approvedProjects.value.unshift({
      ...project,
      status,
      auditTime: new Date().toLocaleString()
    })
  }
}
</script>

<style scoped>
.admin-dashboard {
  background-color: #f9fafb;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader:hover {
  cursor: pointer;
}
</style>