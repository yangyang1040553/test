import request from '@/utils/request'

// 查询用户意见反馈列表
export function listFeedback(query) {
  return request({
    url: '/hash-user/feedback/list',
    method: 'get',
    params: query
  })
}

// 查询用户意见反馈详细
export function getFeedback(id) {
  return request({
    url: '/hash-user/feedback/' + id,
    method: 'get'
  })
}

// 新增用户意见反馈
export function addFeedback(data) {
  return request({
    url: '/hash-user/feedback',
    method: 'post',
    data: data
  })
}

// 修改用户意见反馈
export function updateFeedback(data) {
  return request({
    url: '/hash-user/feedback',
    method: 'put',
    data: data
  })
}

// 删除用户意见反馈
export function delFeedback(id) {
  return request({
    url: '/hash-user/feedback/' + id,
    method: 'delete'
  })
}
