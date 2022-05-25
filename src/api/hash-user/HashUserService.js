import request from '@/utils/request'

// 查询用户列表
export function listHashUserService(query) {
  return request({
    url: '/hash-user/HashUserService/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getHashUserServiceDetail(id) {
  return request({
    url: '/hash-user/HashUserService/detail/' + id,
    method: 'get'
  })
}
// 查询用户详细
export function getHashUserService(id) {
  return request({
    url: '/hash-user/HashUserService/' + id,
    method: 'get'
  })
}

// 新增用户
export function addHashUserService(data) {
  return request({
    url: '/hash-user/HashUserService',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateHashUserService(data) {
  return request({
    url: '/hash-user/HashUserService',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delHashUserService(id) {
  return request({
    url: '/hash-user/HashUserService/' + id,
    method: 'delete'
  })
}
