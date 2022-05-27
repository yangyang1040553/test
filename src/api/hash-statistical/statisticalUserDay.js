import request from '@/utils/request'

// 查询游戏玩家日统计列表
export function listStatisticalUserDay(query) {
  return request({
    url: '/hash-statistical/statisticalUserDay/list',
    method: 'get',
    params: query
  })
}

//查询子项目详情
export function listChildren(query) {
  return request({
    url: '/hash-statistical/statisticalUserDay/childrenList',
    method: 'get',
    params: query
  })
}

// 查询游戏玩家日统计详细
export function getStatisticalUserDay(id) {
  return request({
    url: '/hash-statistical/statisticalUserDay/' + id,
    method: 'get'
  })
}

// 新增游戏玩家日统计
export function addStatisticalUserDay(data) {
  return request({
    url: '/hash-statistical/statisticalUserDay',
    method: 'post',
    data: data
  })
}

// 修改游戏玩家日统计
export function updateStatisticalUserDay(data) {
  return request({
    url: '/hash-statistical/statisticalUserDay',
    method: 'put',
    data: data
  })
}

// 删除游戏玩家日统计
export function delStatisticalUserDay(id) {
  return request({
    url: '/hash-statistical/statisticalUserDay/' + id,
    method: 'delete'
  })
}
