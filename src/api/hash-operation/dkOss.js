import request from '@/utils/request'

// 查询对抗存储列列表
export function listDkOss(query) {
  return request({
    url: '/hash-operation/dkOss/list',
    method: 'get',
    params: query
  })
}

// 查询对抗存储列详细
export function getDkOss(id) {
  return request({
    url: '/hash-operation/dkOss/' + id,
    method: 'get'
  })
}

// 新增对抗存储列
export function addDkOss(data) {
  return request({
    url: '/hash-operation/dkOss',
    method: 'post',
    data: data
  })
}

// 修改对抗存储列
export function updateDkOss(data) {
  return request({
    url: '/hash-operation/dkOss',
    method: 'put',
    data: data
  })
}

// 删除对抗存储列
export function delDkOss(id) {
  return request({
    url: '/hash-operation/dkOss/' + id,
    method: 'delete'
  })
}
