import request from '@/utils/request'

// 查询游戏玩家押注位置日统计列表
export function listStatisticalPlayerPosition(query) {
  return request({
    url: '/hash-statistical/statisticalPlayerPosition/list',
    method: 'get',
    params: query
  })
}

// 查询游戏玩家押注位置日统计详细
export function getStatisticalPlayerPosition(id) {
  return request({
    url: '/hash-statistical/statisticalPlayerPosition/' + id,
    method: 'get'
  })
}

// 新增游戏玩家押注位置日统计
export function addStatisticalPlayerPosition(data) {
  return request({
    url: '/hash-statistical/statisticalPlayerPosition',
    method: 'post',
    data: data
  })
}

// 修改游戏玩家押注位置日统计
export function updateStatisticalPlayerPosition(data) {
  return request({
    url: '/hash-statistical/statisticalPlayerPosition',
    method: 'put',
    data: data
  })
}

// 删除游戏玩家押注位置日统计
export function delStatisticalPlayerPosition(id) {
  return request({
    url: '/hash-statistical/statisticalPlayerPosition/' + id,
    method: 'delete'
  })
}
