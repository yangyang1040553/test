import request from '@/utils/request'

// 查询哈希查询记录列表
export function listHashSelect(query) {
  return request({
    url: '/hash-game/hashSelect/list',
    method: 'get',
    params: query
  })
}

// 查询哈希查询记录详细
export function getHashSelect(id) {
  return request({
    url: '/hash-game/hashSelect/' + id,
    method: 'get'
  })
}

// 新增哈希查询记录
export function addHashSelect(data) {
  return request({
    url: '/hash-game/hashSelect',
    method: 'post',
    data: data
  })
}

// 修改哈希查询记录
export function updateHashSelect(data) {
  return request({
    url: '/hash-game/hashSelect',
    method: 'put',
    data: data
  })
}

// 删除哈希查询记录
export function delHashSelect(id) {
  return request({
    url: '/hash-game/hashSelect/' + id,
    method: 'delete'
  })
}
