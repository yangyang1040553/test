import request from '@/utils/request'

// 查询玩家输赢列表
export function listWin(query) {
  return request({
    url: '/hash-statistical/win/list',
    method: 'get',
    params: query
  })
}

// 查询玩家输赢详细
export function getWin(id) {
  return request({
    url: '/hash-statistical/win/' + id,
    method: 'get'
  })
}

// 新增玩家输赢
export function addWin(data) {
  return request({
    url: '/hash-statistical/win',
    method: 'post',
    data: data
  })
}

// 修改玩家输赢
export function updateWin(data) {
  return request({
    url: '/hash-statistical/win',
    method: 'put',
    data: data
  })
}

// 删除玩家输赢
export function delWin(id) {
  return request({
    url: '/hash-statistical/win/' + id,
    method: 'delete'
  })
}
