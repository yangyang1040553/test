import request from '@/utils/request'

// 查询Banner图列表
export function listBannerConfig(query) {
  return request({
    url: '/hashUser/bannerConfig/list',
    method: 'get',
    params: query
  })
}

// 查询Banner图详细
export function getBannerConfig(id) {
  return request({
    url: '/hashUser/bannerConfig/' + id,
    method: 'get'
  })
}

// 新增Banner图
export function addBannerConfig(data) {
  return request({
    url: '/hashUser/bannerConfig',
    method: 'post',
    data: data
  })
}

// 修改Banner图
export function updateBannerConfig(data) {
  return request({
    url: '/hashUser/bannerConfig',
    method: 'put',
    data: data
  })
}

// 删除Banner图
export function delBannerConfig(id) {
  return request({
    url: '/hashUser/bannerConfig/' + id,
    method: 'delete'
  })
}
