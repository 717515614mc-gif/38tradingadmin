<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalSubmissions }}</div>
            <div class="stat-label">总提交数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendingSubmissions }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.approvedSubmissions }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="recent-card" style="margin-top: 20px;">
      <template #header>
        <span>最近提交记录</span>
      </template>
      
      <el-table :data="recentSubmissions" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userAPI } from '@/api/user'
import { submissionAPI } from '@/api/submission'

const stats = ref({
  totalUsers: 0,
  totalSubmissions: 0,
  pendingSubmissions: 0,
  approvedSubmissions: 0
})

const recentSubmissions = ref([])

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return texts[status] || status
}

const loadDashboardData = async () => {
  try {
    // 加载统计数据
    const statsResponse = await userAPI.getUserStats()
    if (statsResponse.code === 200) {
      stats.value = statsResponse.data
    }
    
    // 加载最近提交记录
    const submissionsResponse = await submissionAPI.getAllSubmissions({
      page: 1,
      size: 5
    })
    if (submissionsResponse.code === 200) {
      recentSubmissions.value = submissionsResponse.data.list || submissionsResponse.data.records || []
    }
  } catch (error) {
    console.error('Load dashboard data error:', error)
    
    // 开发环境下显示模拟数据
    if (import.meta.env.DEV) {
      stats.value = {
        totalUsers: 156,
        totalSubmissions: 89,
        pendingSubmissions: 23,
        approvedSubmissions: 45
      }
      
      recentSubmissions.value = [
        { id: 1, username: 'user1', address: '北京市朝阳区...', status: 'pending', createdAt: '2024-02-01 10:30' },
        { id: 2, username: 'user2', address: '上海市浦东新区...', status: 'approved', createdAt: '2024-02-01 09:15' }
      ]
    }
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  height: 100%;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  padding: 24px 0;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.recent-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.recent-card .el-card__header {
  font-weight: 600;
  font-size: 16px;
}

.el-table {
  border-radius: 4px;
}
</style>
