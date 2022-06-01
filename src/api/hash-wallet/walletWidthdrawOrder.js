import request from '@/utils/request'

// 查询提现审核列表
export function listWalletWidthdrawOrder(query) {
  return request({
    url: '/hash-wallet/walletWidthdrawOrder/list',
    method: 'get',
    params: query
  })
}

// 查询提现审核详细
export function getWalletWidthdrawOrder(id) {
  return request({
    url: '/hash-wallet/walletWidthdrawOrder/' + id,
    method: 'get'
  })
}

// 新增提现审核
export function addWalletWidthdrawOrder(data) {
  return request({
    url: '/hash-wallet/walletWidthdrawOrder',
    method: 'post',
    data: data
  })
}

// 修改提现审核
export function updateWalletWidthdrawOrder(data) {
  return request({
    url: '/hash-wallet/walletWidthdrawOrder',
    method: 'put',
    data: data
  })
}

// 删除提现审核
export function delWalletWidthdrawOrder(id) {
  return request({
    url: '/hash-wallet/walletWidthdrawOrder/' + id,
    method: 'delete'
  })
}
