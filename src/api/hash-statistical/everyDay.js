import request from '@/utils/request'

// 查询钱包日支付统计列表
export function listEveryDay(query) {
  return request({
    url: '/hash-statistical/everyDay/list',
    method: 'get',
    params: query
  })
}

// 查询钱包日支付统计详细
export function getEveryDay(id) {
  return request({
    url: '/hash-statistical/everyDay/' + id,
    method: 'get'
  })
}

// 新增钱包日支付统计
export function addEveryDay(data) {
  return request({
    url: '/hash-statistical/everyDay',
    method: 'post',
    data: data
  })
}

// 修改钱包日支付统计
export function updateEveryDay(data) {
  return request({
    url: '/hash-statistical/everyDay',
    method: 'put',
    data: data
  })
}

// 删除钱包日支付统计
export function delEveryDay(id) {
  return request({
    url: '/hash-statistical/everyDay/' + id,
    method: 'delete'
  })
}
