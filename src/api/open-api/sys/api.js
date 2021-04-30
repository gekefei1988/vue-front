import axios from '@/libs/api.request'
import { formatParams } from '@/libs/util'

// 权限验证
export const getAccess = (params) => {
  let paramsArray = []
  for (let key in params) {
    paramsArray.push(key)
  }

  let postParams = new URLSearchParams({
    accessCodes: paramsArray.toString(',')
  })

  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/open-api/sys/shrio/access'
  })
}

// 获取区域的级联数据
export const getAreaCascader = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/open-api/sys/area/getAreaCascader'
  })
}

// 字典集合
export const getDictList = (params) => {
  let postParams = formatParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/open-api/sys/dict/dict-list'
  })
}
