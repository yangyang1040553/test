import request from '@/utils/request'

// 查询留存分析列表
export function listKeepAlive(query) {
  return request({
    url: '/hash-statistical/keepAlive/list',
    method: 'get',
    params: query
  })
}

// 查询留存分析详细
export function getKeepAlive(registerTime) {
  return request({
    url: '/hash-statistical/keepAlive/' + registerTime,
    method: 'get'
  })
}

// 新增留存分析
export function addKeepAlive(data) {
  return request({
    url: '/hash-statistical/keepAlive',
    method: 'post',
    data: data
  })
}

// 修改留存分析
export function updateKeepAlive(data) {
  return request({
    url: '/hash-statistical/keepAlive',
    method: 'put',
    data: data
  })
}

// 删除留存分析
export function delKeepAlive(registerTime) {
  return request({
    url: '/hash-statistical/keepAlive/' + registerTime,
    method: 'delete'
  })
}
