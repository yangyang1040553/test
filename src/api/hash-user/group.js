import request from '@/utils/request'

// 查询群组列表列表
export function listGroup(query) {
  return request({
    url: '/hash-user/group/list',
    method: 'get',
    params: query
  })
}

// 查询群组列表详细
export function getGroup(groupId) {
  return request({
    url: '/hash-user/group/' + groupId,
    method: 'get'
  })
}

// 新增群组列表
export function addGroup(data) {
  return request({
    url: '/hash-user/group',
    method: 'post',
    data: data
  })
}

// 修改群组列表
export function updateGroup(data) {
  return request({
    url: '/hash-user/group',
    method: 'put',
    data: data
  })
}

// 删除群组列表
export function delGroup(groupId) {
  return request({
    url: '/hash-user/group/' + groupId,
    method: 'delete'
  })
}
