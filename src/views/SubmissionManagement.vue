<template>
  <div class="submission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>记录管理</span>
          <el-button type="primary" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.username"
          placeholder="搜索用户名"
          style="width: 150px; margin-right: 10px;"
          clearable
        />
        <el-select
          v-model="searchForm.status"
          placeholder="审核状态"
          style="width: 120px; margin-right: 10px;"
          clearable
        >
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 提交记录表格 -->
      <el-table
        :data="submissionList"
        :loading="loading"
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="160" />
        <el-table-column prop="reviewedAt" label="审核时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              @click="handleReview(scope.row, 'approved')"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="warning"
              size="small"
              @click="handleReview(scope.row, 'rejected')"
            >
              拒绝
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialog.visible"
      :title="reviewDialog.title"
      width="500px"
    >
      <el-form :model="reviewDialog.form" label-width="80px">
        <el-form-item label="审核状态">
          <el-tag :type="getStatusType(reviewDialog.form.status)">
            {{ getStatusText(reviewDialog.form.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input
            v-model="reviewDialog.form.reviewNote"
            type="textarea"
            :rows="4"
            placeholder="请输入审核备注（可选）"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="reviewDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmReview">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { submissionAPI } from '@/api/submission'

const loading = ref(false)
const submissionList = ref([])

const searchForm = reactive({
  username: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const reviewDialog = reactive({
  visible: false,
  title: '',
  form: {
    id: null,
    status: '',
    reviewNote: ''
  }
})

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

const loadSubmissions = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      username: searchForm.username || undefined,
      status: searchForm.status || undefined
    }
    
    const response = await submissionAPI.getAllSubmissions(params)
    
    if (response.code === 200) {
      submissionList.value = response.data.list || response.data.records || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '加载提交记录失败')
    }
  } catch (error) {
    console.error('Load submissions error:', error)
    ElMessage.error('加载提交记录失败')
    
    // 开发环境下显示模拟数据
    if (import.meta.env.DEV) {
      submissionList.value = [
        {
          id: 1,
          username: 'user1',
          address: '北京市朝阳区建国门外大街1号',
          status: 'pending',
          createdAt: '2024-02-01 10:30:00',
          reviewedAt: null
        },
        {
          id: 2,
          username: 'user2',
          address: '上海市浦东新区陆家嘴环路1000号',
          status: 'approved',
          createdAt: '2024-02-01 09:15:00',
          reviewedAt: '2024-02-01 11:20:00'
        },
        {
          id: 3,
          username: 'user3',
          address: '广州市天河区珠江新城花城大道5号',
          status: 'rejected',
          createdAt: '2024-01-31 16:45:00',
          reviewedAt: '2024-02-01 08:30:00'
        }
      ]
      pagination.total = 3
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadSubmissions()
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.status = ''
  pagination.page = 1
  loadSubmissions()
}

const handleReview = (submission, status) => {
  reviewDialog.form.id = submission.id
  reviewDialog.form.status = status
  reviewDialog.form.reviewNote = ''
  reviewDialog.title = status === 'approved' ? '审核通过' : '审核拒绝'
  reviewDialog.visible = true
}

const confirmReview = async () => {
  try {
    const response = await submissionAPI.reviewSubmission(reviewDialog.form.id, {
      status: reviewDialog.form.status,
      reviewNote: reviewDialog.form.reviewNote
    })
    
    if (response.code === 200) {
      ElMessage.success('审核成功')
      reviewDialog.visible = false
      loadSubmissions()
    } else {
      ElMessage.error(response.message || '审核失败')
    }
  } catch (error) {
    console.error('Review submission error:', error)
    ElMessage.error('审核失败')
  }
}

const handleDelete = async (submission) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除ID为 ${submission.id} 的提交记录吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await submissionAPI.deleteSubmission(submission.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadSubmissions()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete submission error:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pagination.size = val
  pagination.page = 1
  loadSubmissions()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  loadSubmissions()
}

const refreshData = () => {
  loadSubmissions()
}

onMounted(() => {
  loadSubmissions()
})
</script>

<style scoped>
.submission-management {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table {
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
