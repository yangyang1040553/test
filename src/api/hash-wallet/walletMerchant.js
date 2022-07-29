import request from '@/utils/request'

// 查询支付商户配置列表
export function listWalletMerchant(query) {
  return request({
    url: '/hash-wallet/walletMerchant/list',
    method: 'get',
    params: query
  })
}

// 查询支付商户配置详细
export function getWalletMerchant(id) {
  return request({
    url: '/hash-wallet/walletMerchant/' + id,
    method: 'get'
  })
}

// 新增支付商户配置
export function addWalletMerchant(data) {
  return request({
    url: '/hash-wallet/walletMerchant',
    method: 'post',
    data: data
  })
}

// 修改支付商户配置
export function updateWalletMerchant(data) {
  return request({
    url: '/hash-wallet/walletMerchant',
    method: 'put',
    data: data
  })
}

// 删除支付商户配置
export function delWalletMerchant(id) {
  return request({
    url: '/hash-wallet/walletMerchant/' + id,
    method: 'delete'
  })
}
