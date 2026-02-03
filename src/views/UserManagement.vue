<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.username"
          placeholder="搜索用户名"
          style="width: 200px; margin-right: 10px;"
          clearable
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="userList"
        :loading="loading"
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column prop="submissionCount" label="提交数量" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userAPI } from '@/api/user'

const loading = ref(false)
const userList = ref([])

const searchForm = reactive({
  username: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      username: searchForm.username || undefined
    }
    
    const response = await userAPI.getUserList(params)
    
    if (response.code === 200) {
      userList.value = response.data.list || response.data.records || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '加载用户列表失败')
    }
  } catch (error) {
    console.error('Load users error:', error)
    ElMessage.error('加载用户列表失败')
    
    // 开发环境下显示模拟数据
    if (import.meta.env.DEV) {
      userList.value = [
        { id: 1, username: 'user1', createdAt: '2024-01-15 10:30:00', submissionCount: 3 },
        { id: 2, username: 'user2', createdAt: '2024-01-20 14:20:00', submissionCount: 1 },
        { id: 3, username: 'user3', createdAt: '2024-01-25 09:15:00', submissionCount: 5 }
      ]
      pagination.total = 3
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

const resetSearch = () => {
  searchForm.username = ''
  pagination.page = 1
  loadUsers()
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await userAPI.deleteUser(user.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadUsers()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete user error:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (val) => {
  pagination.size = val
  pagination.page = 1
  loadUsers()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  loadUsers()
}

const refreshData = () => {
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
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
