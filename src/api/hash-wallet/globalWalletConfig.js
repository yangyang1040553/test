import request from '@/utils/request'

// 查询钱包全局配置列表
export function listGlobalWalletConfig(query) {
  return request({
    url: '/hash-wallet/globalWalletConfig/list',
    method: 'get',
    params: query
  })
}

// 查询钱包全局配置详细
export function getGlobalWalletConfig(id) {
  return request({
    url: '/hash-wallet/globalWalletConfig/' + id,
    method: 'get'
  })
}

// 新增钱包全局配置
export function addGlobalWalletConfig(data) {
  return request({
    url: '/hash-wallet/globalWalletConfig',
    method: 'post',
    data: data
  })
}

// 修改钱包全局配置
export function updateGlobalWalletConfig(data) {
  return request({
    url: '/hash-wallet/globalWalletConfig',
    method: 'put',
    data: data
  })
}

// 删除钱包全局配置
export function delGlobalWalletConfig(id) {
  return request({
    url: '/hash-wallet/globalWalletConfig/' + id,
    method: 'delete'
  })
}
