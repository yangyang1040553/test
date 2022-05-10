import request from '@/utils/request'

// 查询用户公告列表
export function listHashUserNotice(query) {
  return request({
    url: '/hash-user/hashUserNotice/list',
    method: 'get',
    params: query
  })
}

// 查询用户公告详细
export function getHashUserNotice(id) {
  return request({
    url: '/hash-user/hashUserNotice/' + id,
    method: 'get'
  })
}

// 新增用户公告
export function addHashUserNotice(data) {
  return request({
    url: '/hash-user/hashUserNotice',
    method: 'post',
    data: data
  })
}

// 修改用户公告
export function updateHashUserNotice(data) {
  return request({
    url: '/hash-user/hashUserNotice',
    method: 'put',
    data: data
  })
}

// 删除用户公告
export function delHashUserNotice(id) {
  return request({
    url: '/hash-user/hashUserNotice/' + id,
    method: 'delete'
  })
}
