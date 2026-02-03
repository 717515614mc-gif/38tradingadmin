import request from './request'

export const submissionAPI = {
  // 获取所有提交记录
  getAllSubmissions(params) {
    return request.get('/submission/all', { params })
  },

  // 审核提交记录
  reviewSubmission(id, reviewData) {
    return request.put(`/submission/review/${id}`, reviewData)
  },

  // 删除提交记录
  deleteSubmission(id) {
    return request.delete(`/submission/${id}`)
  }
}
