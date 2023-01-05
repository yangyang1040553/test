import request from '@/utils/request'

// 查询支付通道配置列表
export function listChannel(query) {
  return request({
    url: '/hashUser/channel/list',
    method: 'get',
    params: query
  })
}

// 查询支付通道配置详细
export function getChannel(id) {
  return request({
    url: '/hashUser/channel/' + id,
    method: 'get'
  })
}

// 新增支付通道配置
export function addChannel(data) {
  return request({
    url: '/hashUser/channel',
    method: 'post',
    data: data
  })
}

// 修改支付通道配置
export function updateChannel(data) {
  return request({
    url: '/hashUser/channel',
    method: 'put',
    data: data
  })
}

// 删除支付通道配置
export function delChannel(id) {
  return request({
    url: '/hashUser/channel/' + id,
    method: 'delete'
  })
}
