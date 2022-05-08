import request from '@/utils/request'

// 查询用户列表
export function listUserService(query) {
  return request({
    url: '/user/UserService/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUserService(id) {
  return request({
    url: '/user/UserService/' + id,
    method: 'get'
  })
}

// 新增用户
export function addUserService(data) {
  return request({
    url: '/user/UserService',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUserService(data) {
  return request({
    url: '/user/UserService',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUserService(id) {
  return request({
    url: '/user/UserService/' + id,
    method: 'delete'
  })
}
