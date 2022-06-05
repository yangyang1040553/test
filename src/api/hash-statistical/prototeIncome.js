import request from '@/utils/request'

// 查询代理每日收益金额列表
export function listPrototeIncome(query) {
  return request({
    url: '/hash-statistical/prototeIncome/list',
    method: 'get',
    params: query
  })
}

// 查询代理每日收益金额详细
export function getPrototeIncome(id) {
  return request({
    url: '/hash-statistical/prototeIncome/' + id,
    method: 'get'
  })
}

// 新增代理每日收益金额
export function addPrototeIncome(data) {
  return request({
    url: '/hash-statistical/prototeIncome',
    method: 'post',
    data: data
  })
}

// 修改代理每日收益金额
export function updatePrototeIncome(data) {
  return request({
    url: '/hash-statistical/prototeIncome',
    method: 'put',
    data: data
  })
}

// 删除代理每日收益金额
export function delPrototeIncome(id) {
  return request({
    url: '/hash-statistical/prototeIncome/' + id,
    method: 'delete'
  })
}
