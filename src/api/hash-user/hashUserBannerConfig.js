import request from '@/utils/request'

// 查询用户首页的banner列列表
export function listHashUserBannerConfig(query) {
  return request({
    url: '/hash-user/hashUserBannerConfig/list',
    method: 'get',
    params: query
  })
}

// 查询用户首页的banner列详细
export function getHashUserBannerConfig(id) {
  return request({
    url: '/hash-user/hashUserBannerConfig/' + id,
    method: 'get'
  })
}

// 新增用户首页的banner列
export function addHashUserBannerConfig(data) {
  return request({
    url: '/hash-user/hashUserBannerConfig',
    method: 'post',
    data: data
  })
}

// 修改用户首页的banner列
export function updateHashUserBannerConfig(data) {
  return request({
    url: '/hash-user/hashUserBannerConfig',
    method: 'put',
    data: data
  })
}

// 删除用户首页的banner列
export function delHashUserBannerConfig(id) {
  return request({
    url: '/hash-user/hashUserBannerConfig/' + id,
    method: 'delete'
  })
}
