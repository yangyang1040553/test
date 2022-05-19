import request from '@/utils/request'

// 查询推广记录列表
export function listPromote(query) {
  return request({
    url: '/hash-game/promote/list',
    method: 'get',
    params: query
  })
}

// 查询推广记录详细
export function getPromote(id) {
  return request({
    url: '/hash-game/promote/' + id,
    method: 'get'
  })
}

// 新增推广记录
export function addPromote(data) {
  return request({
    url: '/hash-game/promote',
    method: 'post',
    data: data
  })
}

// 修改推广记录
export function updatePromote(data) {
  return request({
    url: '/hash-game/promote',
    method: 'put',
    data: data
  })
}

// 删除推广记录
export function delPromote(id) {
  return request({
    url: '/hash-game/promote/' + id,
    method: 'delete'
  })
}
