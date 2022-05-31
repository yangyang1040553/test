import request from '@/utils/request'

// 查询用户ip注册次数列表
export function listRegister(query) {
  return request({
    url: '/hash-statistical/register/list',
    method: 'get',
    params: query
  })
}

// 查询用户ip注册次数详细
export function getRegister(ip) {
  return request({
    url: '/hash-statistical/register/' + ip,
    method: 'get'
  })
}

// 新增用户ip注册次数
export function addRegister(data) {
  return request({
    url: '/hash-statistical/register',
    method: 'post',
    data: data
  })
}

// 修改用户ip注册次数
export function updateRegister(data) {
  return request({
    url: '/hash-statistical/register',
    method: 'put',
    data: data
  })
}

// 删除用户ip注册次数
export function delRegister(ip) {
  return request({
    url: '/hash-statistical/register/' + ip,
    method: 'delete'
  })
}
