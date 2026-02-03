// 常量定义
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const SUBMISSION_STATUS_TEXT = {
  [SUBMISSION_STATUS.PENDING]: '待审核',
  [SUBMISSION_STATUS.APPROVED]: '已通过',
  [SUBMISSION_STATUS.REJECTED]: '已拒绝'
}

export const SUBMISSION_STATUS_TYPE = {
  [SUBMISSION_STATUS.PENDING]: 'warning',
  [SUBMISSION_STATUS.APPROVED]: 'success',
  [SUBMISSION_STATUS.REJECTED]: 'danger'
}

export const PAGE_SIZES = [10, 20, 50, 100]

export const DEFAULT_PAGE_SIZE = 10
