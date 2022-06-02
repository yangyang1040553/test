import request from '@/utils/request'

// 查询提现审核列表
export function listAuditWidthdrawOrder(query) {
  return request({
    url: '/hash-audit/auditWidthdrawOrder/list',
    method: 'get',
    params: query
  })
}

// 查询提现审核详细
export function getAuditWidthdrawOrder(id) {
  return request({
    url: '/hash-audit/auditWidthdrawOrder/' + id,
    method: 'get'
  })
}

// 新增提现审核
export function addAuditWidthdrawOrder(data) {
  return request({
    url: '/hash-audit/auditWidthdrawOrder',
    method: 'post',
    data: data
  })
}

// 修改提现审核
export function updateAuditWidthdrawOrder(data) {
  return request({
    url: '/hash-audit/auditWidthdrawOrder',
    method: 'put',
    data: data
  })
}

// 删除提现审核
export function delAuditWidthdrawOrder(id) {
  return request({
    url: '/hash-audit/auditWidthdrawOrder/' + id,
    method: 'delete'
  })
}
