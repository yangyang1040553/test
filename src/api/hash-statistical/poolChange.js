import request from '@/utils/request'

// 查询游戏奖金池变化列表
export function listPoolChange(query) {
  return request({
    url: '/hash-statistical/poolChange/list',
    method: 'get',
    params: query
  })
}

// 查询游戏奖金池变化详细
export function getPoolChange(id) {
  return request({
    url: '/hash-statistical/poolChange/' + id,
    method: 'get'
  })
}

// 新增游戏奖金池变化
export function addPoolChange(data) {
  return request({
    url: '/hash-statistical/poolChange',
    method: 'post',
    data: data
  })
}

// 修改游戏奖金池变化
export function updatePoolChange(data) {
  return request({
    url: '/hash-statistical/poolChange',
    method: 'put',
    data: data
  })
}

// 删除游戏奖金池变化
export function delPoolChange(id) {
  return request({
    url: '/hash-statistical/poolChange/' + id,
    method: 'delete'
  })
}
