import request from '@/utils/request'

// 查询游戏日统计列表
export function listStatisticalGame(query) {
  return request({
    url: '/hash-statistical/statisticalGame/list',
    method: 'get',
    params: query
  })
}

//查询子项目
export function listChildren(query) {
  return request({
    url: '/hash-statistical/statisticalGame/childList',
    method: 'get',
    params: query
  })
}

// 查询游戏日统计详细
export function getStatisticalGame(id) {
  return request({
    url: '/hash-statistical/statisticalGame/' + id,
    method: 'get'
  })
}

// 新增游戏日统计
export function addStatisticalGame(data) {
  return request({
    url: '/hash-statistical/statisticalGame',
    method: 'post',
    data: data
  })
}

// 修改游戏日统计
export function updateStatisticalGame(data) {
  return request({
    url: '/hash-statistical/statisticalGame',
    method: 'put',
    data: data
  })
}

// 删除游戏日统计
export function delStatisticalGame(id) {
  return request({
    url: '/hash-statistical/statisticalGame/' + id,
    method: 'delete'
  })
}
