import request from '@/utils/request'

// 查询佣金提现记录列表
export function listWidthdrawRecord(query) {
  return request({
    url: '/hash-wallet/widthdrawRecord/list',
    method: 'get',
    params: query
  })
}

// 查询佣金提现记录详细
export function getWidthdrawRecord(id) {
  return request({
    url: '/hash-wallet/widthdrawRecord/' + id,
    method: 'get'
  })
}

// 新增佣金提现记录
export function addWidthdrawRecord(data) {
  return request({
    url: '/hash-wallet/widthdrawRecord',
    method: 'post',
    data: data
  })
}

// 修改佣金提现记录
export function updateWidthdrawRecord(data) {
  return request({
    url: '/hash-wallet/widthdrawRecord',
    method: 'put',
    data: data
  })
}

// 删除佣金提现记录
export function delWidthdrawRecord(id) {
  return request({
    url: '/hash-wallet/widthdrawRecord/' + id,
    method: 'delete'
  })
}
