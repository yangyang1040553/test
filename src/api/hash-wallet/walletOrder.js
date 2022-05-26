import request from '@/utils/request'

// 查询转换订单列表
export function listWalletOrder(query) {
  return request({
    url: '/hash-wallet/walletOrder/list',
    method: 'get',
    params: query
  })
}

// 查询转换订单详细
export function getWalletOrder(id) {
  return request({
    url: '/hash-wallet/walletOrder/' + id,
    method: 'get'
  })
}

// 新增转换订单
export function addWalletOrder(data) {
  return request({
    url: '/hash-wallet/walletOrder',
    method: 'post',
    data: data
  })
}

// 修改转换订单
export function updateWalletOrder(data) {
  return request({
    url: '/hash-wallet/walletOrder',
    method: 'put',
    data: data
  })
}

// 删除转换订单
export function delWalletOrder(id) {
  return request({
    url: '/hash-wallet/walletOrder/' + id,
    method: 'delete'
  })
}
