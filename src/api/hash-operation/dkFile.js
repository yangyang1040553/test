import request from '@/utils/request'

// 查询对抗配置文件列表
export function listDkFile(query) {
  return request({
    url: '/hash-operation/dkFile/list',
    method: 'get',
    params: query
  })
}

// 查询对抗配置文件详细
export function getDkFile(id) {
  return request({
    url: '/hash-operation/dkFile/' + id,
    method: 'get'
  })
}

// 新增对抗配置文件
export function addDkFile(data) {
  return request({
    url: '/hash-operation/dkFile',
    method: 'post',
    data: data
  })
}

// 修改对抗配置文件
export function updateDkFile(data) {
  return request({
    url: '/hash-operation/dkFile',
    method: 'put',
    data: data
  })
}

// 删除对抗配置文件
export function delDkFile(id) {
  return request({
    url: '/hash-operation/dkFile/' + id,
    method: 'delete'
  })
}
