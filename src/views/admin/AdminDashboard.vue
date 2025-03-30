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
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold">系统状态</h2>
                <el-tooltip content="实时监控数据" placement="top">
                  <div class="flex items-center text-sm text-green-500">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    实时
                  </div>
                </el-tooltip>
              </div>

              <div class="space-y-6">
                <!-- CPU Usage -->
                <div class="relative">
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center">
                      <el-icon class="mr-2 text-blue-600"><Monitor /></el-icon>
                      <span class="font-medium">CPU使用率</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xl font-bold text-blue-600">{{ metrics.cpu }}%</span>
                      <el-tooltip :content="`过去24小时平均: ${metrics.cpuAvg}%`" placement="top">
                        <span class="text-xs" :class="metrics.cpuTrend > 0 ? 'text-red-500' : 'text-green-500'">
                          {{ metrics.cpuTrend > 0 ? '↑' : '↓' }} {{ Math.abs(metrics.cpuTrend) }}%
                        </span>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                        :style="{ width: `${metrics.cpu}%` }"
                    >
                      <div class="h-full w-full opacity-50 animate-pulse"></div>
                    </div>
                  </div>
                  <div class="mt-2 flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <!-- Memory Usage -->
                <div class="relative">
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center">
                      <el-icon class="mr-2 text-purple-600"><Connection /></el-icon>
                      <span class="font-medium">内存使用率</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xl font-bold text-purple-600">{{ metrics.memory }}%</span>
                      <el-tooltip :content="`过去24小时平均: ${metrics.memoryAvg}%`" placement="top">
                        <span class="text-xs" :class="metrics.memoryTrend > 0 ? 'text-yellow-500' : 'text-green-500'">
                          {{ metrics.memoryTrend > 0 ? '↑' : '↓' }} {{ Math.abs(metrics.memoryTrend) }}%
                        </span>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                        :style="{ width: `${metrics.memory}%` }"
                    >
                      <div class="h-full w-full opacity-50 animate-pulse"></div>
                    </div>
                  </div>
                  <div class="mt-2 flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <!-- Storage Usage -->
                <div class="relative">
                  <div class="flex justify-between text-sm mb-2">
                    <div class="flex items-center">
                      <el-icon class="mr-2 text-green-600"><DataBoard /></el-icon>
                      <span class="font-medium">存储空间</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xl font-bold text-green-600">{{ metrics.storage }}%</span>
                      <el-tooltip :content="`剩余空间: ${metrics.storageRemaining}GB`" placement="top">
                        <span class="text-xs text-green-500">
                          {{ metrics.storage < 80 ? '充足' : '注意' }}
                        </span>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                        :style="{ width: `${metrics.storage}%` }"
                    >
                      <div class="h-full w-full opacity-50 animate-pulse"></div>
                    </div>
                  </div>
                  <div class="mt-2 flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <!-- System Health Summary -->
                <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">系统运行正常</span>
                    </div>
                    <el-tooltip content="上次更新时间" placement="top">
                      <span class="text-xs text-gray-500">{{ metrics.lastUpdate }}</span>
                    </el-tooltip>
                  </div>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Location, Message, Phone, User, Briefcase, OfficeBuilding,
  Money, Search, CaretBottom, SwitchButton, CircleCheck,
  CircleClose, Edit, Delete, Plus, Monitor, Connection, DataBoard
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const metrics = reactive({
  cpu: 0,
  cpuAvg: 0,
  cpuTrend: 0,
  memory: 0,
  memoryAvg: 0,
  memoryTrend: 0,
  storage: 0,
  storageRemaining: 0,
  lastUpdate: ''
})

let metricsInterval: number | null = null

const fetchMetrics = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/system-metrics`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })

    if (!response.ok) throw new Error('Failed to fetch metrics')

    const data = await response.json()

    // Update current metrics
    metrics.cpu = data.cpu
    metrics.memory = data.memory
    metrics.storage = data.storage
    metrics.lastUpdate = new Date().toLocaleTimeString()

    // Simulate historical data for trends
    metrics.cpuAvg = Math.round(data.cpu * 0.9)
    metrics.cpuTrend = Math.round((data.cpu - metrics.cpuAvg) * 10) / 10

    metrics.memoryAvg = Math.round(data.memory * 0.95)
    metrics.memoryTrend = Math.round((data.memory - metrics.memoryAvg) * 10) / 10

    // Calculate remaining storage
    metrics.storageRemaining = Math.round((100 - data.storage) * 10)
  } catch (error) {
    console.error('Error fetching metrics:', error)
  }
}

onMounted(() => {
  fetchMetrics()
  metricsInterval = setInterval(fetchMetrics, 5000) as unknown as number
})

onUnmounted(() => {
  if (metricsInterval) {
    clearInterval(metricsInterval)
  }
})

// Rest of the code remains unchanged...
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
