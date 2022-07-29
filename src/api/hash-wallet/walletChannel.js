import request from '@/utils/request'

// 查询支付通道配置列表
export function listWalletChannel(query) {
  return request({
    url: '/hash-wallet/walletChannel/list',
    method: 'get',
    params: query
  })
}

// 查询支付通道配置详细
export function getWalletChannel(id) {
  return request({
    url: '/hash-wallet/walletChannel/' + id,
    method: 'get'
  })
}

// 新增支付通道配置
export function addWalletChannel(data) {
  return request({
    url: '/hash-wallet/walletChannel',
    method: 'post',
    data: data
  })
}

// 修改支付通道配置
export function updateWalletChannel(data) {
  return request({
    url: '/hash-wallet/walletChannel',
    method: 'put',
    data: data
  })
}

// 删除支付通道配置
export function delWalletChannel(id) {
  return request({
    url: '/hash-wallet/walletChannel/' + id,
    method: 'delete'
  })
}
