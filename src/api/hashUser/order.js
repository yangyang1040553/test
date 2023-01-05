import request from '@/utils/request'

// 查询充值订单记录列表
export function listOrder(query) {
  return request({
    url: '/hashUser/order/list',
    method: 'get',
    params: query
  })
}

// 查询充值订单记录详细
export function getOrder(id) {
  return request({
    url: '/hashUser/order/' + id,
    method: 'get'
  })
}

// 新增充值订单记录
export function addOrder(data) {
  return request({
    url: '/hashUser/order',
    method: 'post',
    data: data
  })
}

// 修改充值订单记录
export function updateOrder(data) {
  return request({
    url: '/hashUser/order',
    method: 'put',
    data: data
  })
}

// 删除充值订单记录
export function delOrder(id) {
  return request({
    url: '/hashUser/order/' + id,
    method: 'delete'
  })
}
