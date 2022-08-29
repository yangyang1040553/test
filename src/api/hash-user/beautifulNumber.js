import request from '@/utils/request'

// 查询用户靓号申请列表
export function listBeautifulNumber(query) {
  return request({
    url: '/hash-user/beautifulNumber/list',
    method: 'get',
    params: query
  })
}

// 查询用户靓号申请详细
export function getBeautifulNumber(id) {
  return request({
    url: '/hash-user/beautifulNumber/' + id,
    method: 'get'
  })
}

// 新增用户靓号申请
export function addBeautifulNumber(data) {
  return request({
    url: '/hash-user/beautifulNumber',
    method: 'post',
    data: data
  })
}

// 修改用户靓号申请
export function updateBeautifulNumber(data) {
  return request({
    url: '/hash-user/beautifulNumber',
    method: 'put',
    data: data
  })
}

// 删除用户靓号申请
export function delBeautifulNumber(id) {
  return request({
    url: '/hash-user/beautifulNumber/' + id,
    method: 'delete'
  })
}
