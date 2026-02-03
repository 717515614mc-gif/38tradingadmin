import request from './request'

export const userAPI = {
  // 获取用户列表
  getUserList(params) {
    return request.get('/user/list', { params })
  },

  // 删除用户
  deleteUser(userId) {
    return request.delete(`/user/${userId}`)
  },

  // 获取用户统计
  getUserStats() {
    return request.get('/user/stats')
  }
}
