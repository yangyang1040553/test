import request from '@/utils/request'

// 查询运营活动奖励记录列表
export function listOperationRecord(query) {
  return request({
    url: '/hash-operation/operationRecord/list',
    method: 'get',
    params: query
  })
}

// 查询运营活动奖励记录详细
export function getOperationRecord(id) {
  return request({
    url: '/hash-operation/operationRecord/' + id,
    method: 'get'
  })
}

// 新增运营活动奖励记录
export function addOperationRecord(data) {
  return request({
    url: '/hash-operation/operationRecord',
    method: 'post',
    data: data
  })
}

// 修改运营活动奖励记录
export function updateOperationRecord(data) {
  return request({
    url: '/hash-operation/operationRecord',
    method: 'put',
    data: data
  })
}

// 删除运营活动奖励记录
export function delOperationRecord(id) {
  return request({
    url: '/hash-operation/operationRecord/' + id,
    method: 'delete'
  })
}
