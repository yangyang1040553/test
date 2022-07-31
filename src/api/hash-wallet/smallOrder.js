import request from '@/utils/request'

// 查询充值订单记录列表
export function listSmallOrder(query) {
  return request({
    url: '/hash-wallet/smallOrder/list',
    method: 'get',
    params: query
  })
}

// 查询充值订单记录详细
export function getSmallOrder(id) {
  return request({
    url: '/hash-wallet/smallOrder/' + id,
    method: 'get'
  })
}

// 新增充值订单记录
export function addSmallOrder(data) {
  return request({
    url: '/hash-wallet/smallOrder',
    method: 'post',
    data: data
  })
}

// 修改充值订单记录
export function updateSmallOrder(data) {
  return request({
    url: '/hash-wallet/smallOrder',
    method: 'put',
    data: data
  })
}

// 删除充值订单记录
export function delSmallOrder(id) {
  return request({
    url: '/hash-wallet/smallOrder/' + id,
    method: 'delete'
  })
}
