import request from '@/utils/request'

// 查询用户钱包列表
export function listManagement(query) {
  return request({
    url: '/hash-wallet/management/list',
    method: 'get',
    params: query
  })
}

// 查询用户钱包详细
export function getManagement(id) {
  return request({
    url: '/hash-wallet/management/' + id,
    method: 'get'
  })
}

// 新增用户钱包
export function addManagement(data) {
  return request({
    url: '/hash-wallet/management',
    method: 'post',
    data: data
  })
}

// 修改用户钱包
export function updateManagement(data) {
  return request({
    url: '/hash-wallet/management',
    method: 'put',
    data: data
  })
}

// 删除用户钱包
export function delManagement(id) {
  return request({
    url: '/hash-wallet/management/' + id,
    method: 'delete'
  })
}
