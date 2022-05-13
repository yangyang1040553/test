import request from '@/utils/request'

// 查询游戏菜单列表
export function listGameMenu(query) {
  return request({
    url: '/hash-game/gameMenu/list',
    method: 'get',
    params: query
  })
}

// 查询游戏菜单详细
export function getGameMenu(id) {
  return request({
    url: '/hash-game/gameMenu/' + id,
    method: 'get'
  })
}

// 新增游戏菜单
export function addGameMenu(data) {
  return request({
    url: '/hash-game/gameMenu',
    method: 'post',
    data: data
  })
}

// 修改游戏菜单
export function updateGameMenu(data) {
  return request({
    url: '/hash-game/gameMenu',
    method: 'put',
    data: data
  })
}

// 删除游戏菜单
export function delGameMenu(id) {
  return request({
    url: '/hash-game/gameMenu/' + id,
    method: 'delete'
  })
}
