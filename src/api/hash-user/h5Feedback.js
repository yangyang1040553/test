import request from '@/utils/request'

// 查询落地页H5反馈列表
export function listH5Feedback(query) {
  return request({
    url: '/hash-user/h5Feedback/list',
    method: 'get',
    params: query
  })
}

// 查询落地页H5反馈详细
export function getH5Feedback(id) {
  return request({
    url: '/hash-user/h5Feedback/' + id,
    method: 'get'
  })
}

// 新增落地页H5反馈
export function addH5Feedback(data) {
  return request({
    url: '/hash-user/h5Feedback',
    method: 'post',
    data: data
  })
}

// 修改落地页H5反馈
export function updateH5Feedback(data) {
  return request({
    url: '/hash-user/h5Feedback',
    method: 'put',
    data: data
  })
}

// 删除落地页H5反馈
export function delH5Feedback(id) {
  return request({
    url: '/hash-user/h5Feedback/' + id,
    method: 'delete'
  })
}
