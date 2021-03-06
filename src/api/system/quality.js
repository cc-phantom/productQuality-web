import request from '@/utils/request'

export function getAllQuality() {
  const params = {
    page: 0,
    size: 9999,
    enabled: 1
  }
  return request({
    url: 'api/pqQuality',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/pqQuality',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/pqQuality',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/pqQuality',
    method: 'put',
    data
  })
}

export default { add, edit, del }
