import request from '@/utils/request'

// 查询支付类型配置列表
export function listType(query) {
  return request({
    url: '/hashUser/type/list',
    method: 'get',
    params: query
  })
}

// 查询支付类型配置详细
export function getType(id) {
  return request({
    url: '/hashUser/type/' + id,
    method: 'get'
  })
}

// 新增支付类型配置
export function addType(data) {
  return request({
    url: '/hashUser/type',
    method: 'post',
    data: data
  })
}

// 修改支付类型配置
export function updateType(data) {
  return request({
    url: '/hashUser/type',
    method: 'put',
    data: data
  })
}

// 删除支付类型配置
export function delType(id) {
  return request({
    url: '/hashUser/type/' + id,
    method: 'delete'
  })
}
