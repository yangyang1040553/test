import request from '@/utils/request'

// 查询用户短信功能列表
export function listHashUserSms(query) {
  return request({
    url: '/hash-user/hashUserSms/list',
    method: 'get',
    params: query
  })
}

// 查询用户短信功能详细
export function getHashUserSms(id) {
  return request({
    url: '/hash-user/hashUserSms/' + id,
    method: 'get'
  })
}

// 新增用户短信功能
export function addHashUserSms(data) {
  return request({
    url: '/hash-user/hashUserSms',
    method: 'post',
    data: data
  })
}

// 修改用户短信功能
export function updateHashUserSms(data) {
  return request({
    url: '/hash-user/hashUserSms',
    method: 'put',
    data: data
  })
}

// 删除用户短信功能
export function delHashUserSms(id) {
  return request({
    url: '/hash-user/hashUserSms/' + id,
    method: 'delete'
  })
}
