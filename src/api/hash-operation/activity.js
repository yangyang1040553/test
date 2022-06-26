import request from '@/utils/request'

// 查询运营活动列表
export function listActivity(query) {
  return request({
    url: '/hash-operation/activity/list',
    method: 'get',
    params: query
  })
}

// 查询运营活动详细
export function getActivity(id) {
  return request({
    url: '/hash-operation/activity/' + id,
    method: 'get'
  })
}

// 新增运营活动
export function addActivity(data) {
  return request({
    url: '/hash-operation/activity',
    method: 'post',
    data: data
  })
}

// 修改运营活动
export function updateActivity(data) {
  return request({
    url: '/hash-operation/activity',
    method: 'put',
    data: data
  })
}

// 删除运营活动
export function delActivity(id) {
  return request({
    url: '/hash-operation/activity/' + id,
    method: 'delete'
  })
}
