import request from '@/utils/request'

// 查询VIP类型配置列表
export function listConfig(query) {
  return request({
    url: '/hashUser/config/list',
    method: 'get',
    params: query
  })
}

// 查询VIP类型配置详细
export function getConfig(id) {
  return request({
    url: '/hashUser/config/' + id,
    method: 'get'
  })
}

// 新增VIP类型配置
export function addConfig(data) {
  return request({
    url: '/hashUser/config',
    method: 'post',
    data: data
  })
}

// 修改VIP类型配置
export function updateConfig(data) {
  return request({
    url: '/hashUser/config',
    method: 'put',
    data: data
  })
}

// 删除VIP类型配置
export function delConfig(id) {
  return request({
    url: '/hashUser/config/' + id,
    method: 'delete'
  })
}
