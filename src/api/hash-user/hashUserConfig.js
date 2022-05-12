import request from '@/utils/request'

// 查询用户全局配置列表
export function listHashUserConfig(query) {
  return request({
    url: '/hash-user/hashUserConfig/list',
    method: 'get',
    params: query
  })
}

// 查询用户全局配置详细
export function getHashUserConfig(id) {
  return request({
    url: '/hash-user/hashUserConfig/' + id,
    method: 'get'
  })
}

// 新增用户全局配置
export function addHashUserConfig(data) {
  return request({
    url: '/hash-user/hashUserConfig',
    method: 'post',
    data: data
  })
}

// 修改用户全局配置
export function updateHashUserConfig(data) {
  return request({
    url: '/hash-user/hashUserConfig',
    method: 'put',
    data: data
  })
}

// 删除用户全局配置
export function delHashUserConfig(id) {
  return request({
    url: '/hash-user/hashUserConfig/' + id,
    method: 'delete'
  })
}
