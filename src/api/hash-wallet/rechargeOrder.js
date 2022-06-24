import request from '@/utils/request'

// 查询充值列表
export function listRechargeOrder(query) {
  return request({
    url: '/hash-wallet/rechargeOrder/list',
    method: 'get',
    params: query
  })
}
export function getCurrDay(query) {
  return request({
    url: '/hash-wallet/rechargeOrder/getCurrDay',
    method: 'get',
    params: query
  })
}

// 查询充值详细
export function getRechargeOrder(id) {
  return request({
    url: '/hash-wallet/rechargeOrder/' + id,
    method: 'get'
  })
}

// 新增充值
export function addRechargeOrder(data) {
  return request({
    url: '/hash-wallet/rechargeOrder',
    method: 'post',
    data: data
  })
}

// 修改充值
export function updateRechargeOrder(data) {
  return request({
    url: '/hash-wallet/rechargeOrder',
    method: 'put',
    data: data
  })
}

// 删除充值
export function delRechargeOrder(id) {
  return request({
    url: '/hash-wallet/rechargeOrder/' + id,
    method: 'delete'
  })
}
