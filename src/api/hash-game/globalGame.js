import request from '@/utils/request'

// 查询游戏共用配置列表
export function listGlobalGame(query) {
  return request({
    url: '/hash-game/globalGame/list',
    method: 'get',
    params: query
  })
}

// 查询游戏共用配置详细
export function getGlobalGame(id) {
  return request({
    url: '/hash-game/globalGame/' + id,
    method: 'get'
  })
}

// 新增游戏共用配置
export function addGlobalGame(data) {
  return request({
    url: '/hash-game/globalGame',
    method: 'post',
    data: data
  })
}

// 修改游戏共用配置
export function updateGlobalGame(data) {
  return request({
    url: '/hash-game/globalGame',
    method: 'put',
    data: data
  })
}

// 删除游戏共用配置
export function delGlobalGame(id) {
  return request({
    url: '/hash-game/globalGame/' + id,
    method: 'delete'
  })
}
