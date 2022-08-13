import request from '@/utils/request'

// 查询游戏输赢列表
export function listGameWin(query) {
  return request({
    url: '/hash-statistical/gameWin/list',
    method: 'get',
    params: query
  })
}

// 查询游戏输赢详细
export function getGameWin(id) {
  return request({
    url: '/hash-statistical/gameWin/' + id,
    method: 'get'
  })
}

// 新增游戏输赢
export function addGameWin(data) {
  return request({
    url: '/hash-statistical/gameWin',
    method: 'post',
    data: data
  })
}

// 修改游戏输赢
export function updateGameWin(data) {
  return request({
    url: '/hash-statistical/gameWin',
    method: 'put',
    data: data
  })
}

// 删除游戏输赢
export function delGameWin(id) {
  return request({
    url: '/hash-statistical/gameWin/' + id,
    method: 'delete'
  })
}
