import axios from '@/libs/api.request'
import { formatParams, fmtSearchParams } from '@/libs/util'

export const list = (params) => {
  let postParams = fmtSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/area/list'
  })
}

// 保存
export const save = (params) => {
  let postParams = formatParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/area/save'
  })
}

// 获取单条数据
export const get = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/area/get'
  })
}

// 删除
export const del = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/area/delete'
  })
}

// 自定义表单验证字典名称和类型
export const validateOnlyOne = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/area/onlyOne'
  })
}
