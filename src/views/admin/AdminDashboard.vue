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
          <!-- User Management -->
          <div class="lg:col-span-2">
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
          </div>

          <!-- Recent Activities -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">最近活动</h2>
              <div class="space-y-6">
                <div v-for="activity in recentActivities" :key="activity.id" 
                     class="flex items-start space-x-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                       :class="activity.iconBg">
                    <el-icon :class="activity.iconColor" :size="16">
                      <component :is="activity.icon" />
                    </el-icon>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 class="text-xl font-bold mb-6">数据统计</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">项目审核率</span>
                    <span class="font-medium">85%</span>
                  </div>
                  <el-progress :percentage="85" />
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">用户活跃度</span>
                    <span class="font-medium">92%</span>
                  </div>
                  <el-progress :percentage="92" type="success" />
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">资源利用率</span>
                    <span class="font-medium">78%</span>
                  </div>
                  <el-progress :percentage="78" type="warning" />
                </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  User, Briefcase, OfficeBuilding, Money, Search,
  CircleCheck, CircleClose, Edit, Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Search and filter
const searchQuery = ref('')
const userType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// Edit dialog
const showEditDialog = ref(false)
const editForm = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  status: true
})

// Mock users data
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

// Recent activities data
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
  },
  {
    id: 4,
    icon: 'CircleCheck',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    description: '项目审核通过: 校园二手书交易平台',
    time: '2小时前'
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
</script>

<style scoped>
.admin-dashboard {
  background-color: #f9fafb;
}
</style>