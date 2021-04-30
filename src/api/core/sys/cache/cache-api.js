import axios from '@/libs/api.request'

// 获取缓存类型
export const getCacheNames = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/cache/getCacheNames'
  })
}

// 获取缓存信息
export const getCacheList = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/cache/getCacheList'
  })
}

// 清空缓存信息
export const clearCache = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/cache/clearCache'
  })
}
