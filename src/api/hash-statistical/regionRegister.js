import request from '@/utils/request'

// 查询用户区域注册次数列表
export function listRegister(query) {
  return request({
    url: '/hash-statistical/regionRegister/list',
    method: 'get',
    params: query
  })
}

// 查询用户区域注册次数详细
export function getRegister(region) {
  return request({
    url: '/hash-statistical/regionRegister/' + region,
    method: 'get'
  })
}

// 新增用户区域注册次数
export function addRegister(data) {
  return request({
    url: '/hash-statistical/regionRegister',
    method: 'post',
    data: data
  })
}

// 修改用户区域注册次数
export function updateRegister(data) {
  return request({
    url: '/hash-statistical/regionRegister',
    method: 'put',
    data: data
  })
}

// 删除用户区域注册次数
export function delRegister(region) {
  return request({
    url: '/hash-statistical/regionRegister/' + region,
    method: 'delete'
  })
}
