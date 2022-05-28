import request from '@/utils/request'

// 查询玩家运营数据列表
export function listRedisOnLineList(query) {
  return request({
    url: '/hash-statistical/redis/onlineList',
    method: 'post',
    data: query
  })
}