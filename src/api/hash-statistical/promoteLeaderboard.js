import request from '@/utils/request'

// 查询VIEW列表
export function listPromoteLeaderboard(query) {
  return request({
    url: '/hash-statistical/promoteLeaderboard/list',
    method: 'get',
    params: query
  })
}

// 查询VIEW详细
export function getPromoteLeaderboard(id) {
  return request({
    url: '/hash-statistical/promoteLeaderboard/' + id,
    method: 'get'
  })
}

// 新增VIEW
export function addPromoteLeaderboard(data) {
  return request({
    url: '/hash-statistical/promoteLeaderboard',
    method: 'post',
    data: data
  })
}

// 修改VIEW
export function updatePromoteLeaderboard(data) {
  return request({
    url: '/hash-statistical/promoteLeaderboard',
    method: 'put',
    data: data
  })
}

// 删除VIEW
export function delPromoteLeaderboard(id) {
  return request({
    url: '/hash-statistical/promoteLeaderboard/' + id,
    method: 'delete'
  })
}
