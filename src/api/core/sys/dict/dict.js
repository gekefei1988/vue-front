import axios from '@/libs/api.request'
import { getToken } from '@/libs/util.js'

/**
 *  获取字典类型信息.
 */
export async function typeList (params) {
  let postParams = Object.assign({}, params.searchParams)
  Object.assign(postParams, params.pageContent)
  delete postParams.content
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/sys/dict-type/list'
  })
}

/**
 * 删除信息.
 * id 主键
 */
export const typeDeleteById = (id) => {
  return axios.request({
    method: 'get',
    url: '/core/sys/dict-type/delete' + '?id=' + id
  })
}

/**
 * 获取信息.
 * id 主键
 */
export const typeGet = (id) => {
  return axios.request({
    method: 'get',
    url: '/core/sys/dict-data/get' + '?id=' + id
  })
}

/**
 * 保存字典类型信息.
 * params dict type对象
 */
export const typeSave = (params) => {
  return axios.request({
    method: 'post',
    data: params,
    url: '/core/sys/dict-data/save'
  })
}

/**
 * 验证唯一性.
 * propName
 * propValue
 * id
 */
export const typeOnlyOne = (params) => {
  return axios.request({
    method: 'post',
    data: params,
    url: '/core/sys/dict-type/onlyOne'
  })
}

/**
 * 删除信息.
 * id 主键
 */
export const dataDeleteById = (id) => {
  return axios.request({
    method: 'get',
    url: '/core/sys/dict-data/delete' + '?id=' + id
  })
}

/**
 * 获取信息.
 * id 主键
 */
export const dataGet = (id) => {
  return axios.request({
    method: 'get',
    url: '/core/sys/dict-data/get' + '?id=' + id
  })
}

/**
 * 保存字典类型信息.
 * params data 对象
 */
export const dataSave = (params) => {
  return axios.request({
    method: 'post',
    data: params,
    url: '/core/sys/dict-data/save'
  })
}

/**
 *  获取字典类型信息.
 */
export async function dataListTree (params) {
  return axios.request({
    method: 'post',
    data: params,
    url: '/core/sys/dict-data/listTreeDictData'
  })
}

/**
 * 保存字典数据信息.
 * params List<DictData>对象
 * parentId
 * dictType
 */
export const saveDataList = (params, parentId, dictType) => {
  return axios.request({
    method: 'post',
    parameterFmt: 'json',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'content-type': 'application/json;charset=UTF-8',
      'auth-token': getToken()
    },
    data: params,
    url: '/core/sys/dict-data/saveDataList' + '?parentId=' + parentId + '&dictType=' + dictType
  })
}
