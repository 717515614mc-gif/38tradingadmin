import request from './request'

export const authAPI = {
  // 管理员登录
  login(credentials) {
    return request.post('/auth/login', {
      username: credentials.username,
      password: credentials.password
    })
  },

  // 管理员注册
  register(userData) {
    return request.post('/auth/register', {
      username: userData.username,
      password: userData.password
    })
  }
}
