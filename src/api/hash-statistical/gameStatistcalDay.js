import request from '@/utils/request'

// 查询游戏押注位置日统计列表
export function listGameStatistcalDay(query) {
  return request({
    url: '/hash-statistical/gameStatistcalDay/list',
    method: 'get',
    params: query
  })
}

// 查询游戏押注位置日统计详细
export function getGameStatistcalDay(id) {
  return request({
    url: '/hash-statistical/gameStatistcalDay/' + id,
    method: 'get'
  })
}

// 新增游戏押注位置日统计
export function addGameStatistcalDay(data) {
  return request({
    url: '/hash-statistical/gameStatistcalDay',
    method: 'post',
    data: data
  })
}

// 修改游戏押注位置日统计
export function updateGameStatistcalDay(data) {
  return request({
    url: '/hash-statistical/gameStatistcalDay',
    method: 'put',
    data: data
  })
}

// 删除游戏押注位置日统计
export function delGameStatistcalDay(id) {
  return request({
    url: '/hash-statistical/gameStatistcalDay/' + id,
    method: 'delete'
  })
}
