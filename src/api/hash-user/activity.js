import request from '@/utils/request'

// 查询用户的活动列表
export function listActivity(query) {
  return request({
    url: '/hash-user/activity/list',
    method: 'get',
    params: query
  })
}

// 查询用户的活动详细
export function getActivity(id) {
  return request({
    url: '/hash-user/activity/' + id,
    method: 'get'
  })
}

// 新增用户的活动
export function addActivity(data) {
  return request({
    url: '/hash-user/activity',
    method: 'post',
    data: data
  })
}

// 修改用户的活动
export function updateActivity(data) {
  return request({
    url: '/hash-user/activity',
    method: 'put',
    data: data
  })
}

// 删除用户的活动
export function delActivity(id) {
  return request({
    url: '/hash-user/activity/' + id,
    method: 'delete'
  })
}
