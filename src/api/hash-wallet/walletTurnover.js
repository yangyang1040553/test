import request from '@/utils/request'

// 查询钱包流水记录列表
export function listWalletTurnover(query) {
  return request({
    url: '/hash-wallet/walletTurnover/list',
    method: 'get',
    params: query
  })
}

// 查询钱包流水记录详细
export function getWalletTurnover(id) {
  return request({
    url: '/hash-wallet/walletTurnover/' + id,
    method: 'get'
  })
}

// 新增钱包流水记录
export function addWalletTurnover(data) {
  return request({
    url: '/hash-wallet/walletTurnover',
    method: 'post',
    data: data
  })
}

// 修改钱包流水记录
export function updateWalletTurnover(data) {
  return request({
    url: '/hash-wallet/walletTurnover',
    method: 'put',
    data: data
  })
}

// 删除钱包流水记录
export function delWalletTurnover(id) {
  return request({
    url: '/hash-wallet/walletTurnover/' + id,
    method: 'delete'
  })
}
