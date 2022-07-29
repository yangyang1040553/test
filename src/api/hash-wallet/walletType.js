import request from '@/utils/request'

// 查询支付类型配置列表
export function listWalletType(query) {
  return request({
    url: '/hash-wallet/walletType/list',
    method: 'get',
    params: query
  })
}

// 查询支付类型配置详细
export function getWalletType(id) {
  return request({
    url: '/hash-wallet/walletType/' + id,
    method: 'get'
  })
}

// 新增支付类型配置
export function addWalletType(data) {
  return request({
    url: '/hash-wallet/walletType',
    method: 'post',
    data: data
  })
}

// 修改支付类型配置
export function updateWalletType(data) {
  return request({
    url: '/hash-wallet/walletType',
    method: 'put',
    data: data
  })
}

// 删除支付类型配置
export function delWalletType(id) {
  return request({
    url: '/hash-wallet/walletType/' + id,
    method: 'delete'
  })
}
