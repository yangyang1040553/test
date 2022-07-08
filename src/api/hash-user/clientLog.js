import request from '@/utils/request'

// 查询客户端日志列表
export function listClientLog(query) {
  return request({
    url: '/hash-user/clientLog/list',
    method: 'get',
    params: query
  })
}

// 查询客户端日志详细
export function getClientLog(id) {
  return request({
    url: '/hash-user/clientLog/' + id,
    method: 'get'
  })
}

// 新增客户端日志
export function addClientLog(data) {
  return request({
    url: '/hash-user/clientLog',
    method: 'post',
    data: data
  })
}

// 修改客户端日志
export function updateClientLog(data) {
  return request({
    url: '/hash-user/clientLog',
    method: 'put',
    data: data
  })
}

// 删除客户端日志
export function delClientLog(id) {
  return request({
    url: '/hash-user/clientLog/' + id,
    method: 'delete'
  })
}
