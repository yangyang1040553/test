import request from '@/utils/request'

// 查询版本控制列表
export function listGlobalConfig(query) {
  return request({
    url: '/hashUser/globalConfig/list',
    method: 'get',
    params: query
  })
}

// 查询版本控制详细
export function getGlobalConfig(id) {
  return request({
    url: '/hashUser/globalConfig/' + id,
    method: 'get'
  })
}

// 新增版本控制
export function addGlobalConfig(data) {
  return request({
    url: '/hashUser/globalConfig',
    method: 'post',
    data: data
  })
}

// 修改版本控制
export function updateGlobalConfig(data) {
  return request({
    url: '/hashUser/globalConfig',
    method: 'put',
    data: data
  })
}

// 删除版本控制
export function delGlobalConfig(id) {
  return request({
    url: '/hashUser/globalConfig/' + id,
    method: 'delete'
  })
}
