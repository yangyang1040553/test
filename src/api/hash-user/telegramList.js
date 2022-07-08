import request from '@/utils/request'

// 查询用户飞机列表
export function listTelegramList(query) {
  return request({
    url: '/hash-user/telegramList/list',
    method: 'get',
    params: query
  })
}

// 查询用户飞机详细
export function getTelegramList(id) {
  return request({
    url: '/hash-user/telegramList/' + id,
    method: 'get'
  })
}

// 新增用户飞机
export function addTelegramList(data) {
  return request({
    url: '/hash-user/telegramList',
    method: 'post',
    data: data
  })
}

// 修改用户飞机
export function updateTelegramList(data) {
  return request({
    url: '/hash-user/telegramList',
    method: 'put',
    data: data
  })
}

// 删除用户飞机
export function delTelegramList(id) {
  return request({
    url: '/hash-user/telegramList/' + id,
    method: 'delete'
  })
}
