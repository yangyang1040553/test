import request from '@/utils/request'

// 查询游戏投注记录列表
export function listRecord(query) {
  return request({
    url: '/hash-game/record/list',
    method: 'get',
    params: query
  })
}

// 查询游戏投注记录详细
export function getRecord(id) {
  return request({
    url: '/hash-game/record/' + id,
    method: 'get'
  })
}

// 新增游戏投注记录
export function addRecord(data) {
  return request({
    url: '/hash-game/record',
    method: 'post',
    data: data
  })
}

// 修改游戏投注记录
export function updateRecord(data) {
  return request({
    url: '/hash-game/record',
    method: 'put',
    data: data
  })
}

// 删除游戏投注记录
export function delRecord(id) {
  return request({
    url: '/hash-game/record/' + id,
    method: 'delete'
  })
}
