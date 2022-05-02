import request from '@/utils/request'

// 查询机器人列表
export function listBot(query) {
  return request({
    url: '/telegram/bot/list',
    method: 'get',
    params: query
  })
}

// 查询机器人详细
export function getBot(id) {
  return request({
    url: '/telegram/bot/' + id,
    method: 'get'
  })
}

// 新增机器人
export function addBot(data) {
  return request({
    url: '/telegram/bot',
    method: 'post',
    data: data
  })
}

// 修改机器人
export function updateBot(data) {
  return request({
    url: '/telegram/bot',
    method: 'put',
    data: data
  })
}

// 删除机器人
export function delBot(id) {
  return request({
    url: '/telegram/bot/' + id,
    method: 'delete'
  })
}
