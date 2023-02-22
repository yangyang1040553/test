import request from '@/utils/request'

// 查询黑料内容列表
export function listBlackContent(query) {
  return request({
    url: '/hashUser/blackContent/list',
    method: 'get',
    params: query
  })
}

// 查询黑料内容详细
export function getBlackContent(id) {
  return request({
    url: '/hashUser/blackContent/' + id,
    method: 'get'
  })
}

// 新增黑料内容
export function addBlackContent(data) {
  return request({
    url: '/hashUser/blackContent',
    method: 'post',
    data: data
  })
}

// 修改黑料内容
export function updateBlackContent(data) {
  return request({
    url: '/hashUser/blackContent',
    method: 'put',
    data: data
  })
}

// 删除黑料内容
export function delBlackContent(id) {
  return request({
    url: '/hashUser/blackContent/' + id,
    method: 'delete'
  })
}

//上传文件
export function uploadFile(data) {
  return request({
    url: '/dark/file/upload',
    method: 'post',
    data
  })
}
