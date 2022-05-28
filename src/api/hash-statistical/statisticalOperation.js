import request from '@/utils/request'

// 查询玩家运营数据列表
export function listStatisticalOperation(query) {
  return request({
    url: '/hash-statistical/statisticalOperation/list',
    method: 'get',
    params: query
  })
}

// 查询玩家运营数据详细
export function getStatisticalOperation(id) {
  return request({
    url: '/hash-statistical/statisticalOperation/' + id,
    method: 'get'
  })
}

// 新增玩家运营数据
export function addStatisticalOperation(data) {
  return request({
    url: '/hash-statistical/statisticalOperation',
    method: 'post',
    data: data
  })
}

// 修改玩家运营数据
export function updateStatisticalOperation(data) {
  return request({
    url: '/hash-statistical/statisticalOperation',
    method: 'put',
    data: data
  })
}

// 删除玩家运营数据
export function delStatisticalOperation(id) {
  return request({
    url: '/hash-statistical/statisticalOperation/' + id,
    method: 'delete'
  })
}
