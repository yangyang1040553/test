import request from '@/utils/request'

// 查询视频收藏列表
export function listCollect(query) {
  return request({
    url: '/hashUser/collect/list',
    method: 'get',
    params: query
  })
}

// 查询视频收藏详细
export function getCollect(id) {
  return request({
    url: '/hashUser/collect/' + id,
    method: 'get'
  })
}

// 新增视频收藏
export function addCollect(data) {
  return request({
    url: '/hashUser/collect',
    method: 'post',
    data: data
  })
}

// 修改视频收藏
export function updateCollect(data) {
  return request({
    url: '/hashUser/collect',
    method: 'put',
    data: data
  })
}

// 删除视频收藏
export function delCollect(id) {
  return request({
    url: '/hashUser/collect/' + id,
    method: 'delete'
  })
}
