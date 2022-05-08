import request from '@/utils/request'

// 查询游戏配置
export function listConfig(query) {
  return request({
    url: '/hash-game/config/list',
    method: 'get',
    params: query
  })
}

// 查询游戏配置
export function getConfig(id) {
  return request({
    url: '/hash-game/config/' + id,
    method: 'get'
  })
}

// 新增游戏配置

export function addConfig(data) {
  return request({
    url: '/hash-game/config',
    method: 'post',
    data: data
  })
}

// 修改游戏配置

export function updateConfig(data) {
  return request({
    url: '/hash-game/config',
    method: 'put',
    data: data
  })
}

// 删除游戏配置

export function delConfig(id) {
  return request({
    url: '/hash-game/config/' + id,
    method: 'delete'
  })
}
