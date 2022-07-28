import request from '@/utils/request'

// 查询对抗域名列列表
export function listDomanList(query) {
  return request({
    url: '/hash-operation/domanList/list',
    method: 'get',
    params: query
  })
}

// 查询对抗域名列详细
export function getDomanList(id) {
  return request({
    url: '/hash-operation/domanList/' + id,
    method: 'get'
  })
}

// 新增对抗域名列
export function addDomanList(data) {
  return request({
    url: '/hash-operation/domanList',
    method: 'post',
    data: data
  })
}

// 修改对抗域名列
export function updateDomanList(data) {
  return request({
    url: '/hash-operation/domanList',
    method: 'put',
    data: data
  })
}

// 删除对抗域名列
export function delDomanList(id) {
  return request({
    url: '/hash-operation/domanList/' + id,
    method: 'delete'
  })
}
