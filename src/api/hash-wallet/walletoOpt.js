import request from '@/utils/request'

// 查询人工出入款列表
export function listWalletoOpt(query) {
  return request({
    url: '/hash-wallet/walletoOpt/list',
    method: 'get',
    params: query
  })
}

// 查询人工出入款详细
export function getWalletoOpt(id) {
  return request({
    url: '/hash-wallet/walletoOpt/' + id,
    method: 'get'
  })
}

// 新增人工出入款
export function addWalletoOpt(data) {
  return request({
    url: '/hash-wallet/walletoOpt',
    method: 'post',
    data: data
  })
}

// 修改人工出入款
export function updateWalletoOpt(data) {
  return request({
    url: '/hash-wallet/walletoOpt',
    method: 'put',
    data: data
  })
}

// 删除人工出入款
export function delWalletoOpt(id) {
  return request({
    url: '/hash-wallet/walletoOpt/' + id,
    method: 'delete'
  })
}
