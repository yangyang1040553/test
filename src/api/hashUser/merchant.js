import request from '@/utils/request'

// 查询支付商户配置列表
export function listMerchant(query) {
  return request({
    url: '/hashUser/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询支付商户配置详细
export function getMerchant(id) {
  return request({
    url: '/hashUser/merchant/' + id,
    method: 'get'
  })
}

// 新增支付商户配置
export function addMerchant(data) {
  return request({
    url: '/hashUser/merchant',
    method: 'post',
    data: data
  })
}

// 修改支付商户配置
export function updateMerchant(data) {
  return request({
    url: '/hashUser/merchant',
    method: 'put',
    data: data
  })
}

// 删除支付商户配置
export function delMerchant(id) {
  return request({
    url: '/hashUser/merchant/' + id,
    method: 'delete'
  })
}
