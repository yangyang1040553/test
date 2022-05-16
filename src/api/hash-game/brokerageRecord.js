import request from '@/utils/request'

// 查询玩家返佣记录列表
export function listBrokerageRecord(query) {
  return request({
    url: '/hash-game/brokerageRecord/list',
    method: 'get',
    params: query
  })
}

// 查询玩家返佣记录详细
export function getBrokerageRecord(id) {
  return request({
    url: '/hash-game/brokerageRecord/' + id,
    method: 'get'
  })
}

// 新增玩家返佣记录
export function addBrokerageRecord(data) {
  return request({
    url: '/hash-game/brokerageRecord',
    method: 'post',
    data: data
  })
}

// 修改玩家返佣记录
export function updateBrokerageRecord(data) {
  return request({
    url: '/hash-game/brokerageRecord',
    method: 'put',
    data: data
  })
}

// 删除玩家返佣记录
export function delBrokerageRecord(id) {
  return request({
    url: '/hash-game/brokerageRecord/' + id,
    method: 'delete'
  })
}
