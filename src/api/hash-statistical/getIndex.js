import request from '@/utils/request'

// 查询留存分析列表
export function getIndex(query) {
  return request({
    url: '/hash-statistical/index/list',
    method: 'get',
    params: query
  })
}

export function currAmountInfo(query) {
  return request({
    url: '/hash-statistical/index/currAmountInfo',
    method: 'get',
    params: query
  })
}

