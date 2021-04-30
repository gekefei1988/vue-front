import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 修改机构状态.
 */
export const modifyTenantStauts = (id, tenantStatus) => {
  return axios.request({
    method: 'post',
    data: qs.stringify({
      id: id,
      tenantStatus: tenantStatus
    }),
    url: '/core/sys/tenant/modifyTenantStauts'
  })
}

/**
 * 查询注册记录表.
 */
export const getRegRecList = (params) => {
  let postParams = Object.assign({}, params.searchParams)
  Object.assign(postParams, params.pageContent)
  delete postParams.content
  return axios.request({
    method: 'post',
    data: qs.stringify(postParams),
    url: '/core/sys/tenant/reg-rec/list'
  })
}

/**
 * 机构列表.
 */
export const getTenantList = (params) => {
  let postParams = Object.assign({}, params.searchParams)
  Object.assign(postParams, params.pageContent)
  delete postParams.content
  return axios.request({
    method: 'post',
    data: qs.stringify(postParams),
    url: '/core/sys/tenant/list'
  })
}

/**
 * 唯一验证.
 */
export const onlyOne = (params) => {
  return axios.request({
    method: 'post',
    data: qs.stringify(params),
    url: '/core/sys/tenant/onlyOne'
  })
}

/**
 * 获取启动的机构信息.
 */
export const getTenants = () => {
  return axios.request({
    method: 'post',
    url: '/core/sys/tenant/getTenants'
  })
}

/**
 * 企业认证机构信息.
 */
export const submitCertCompany = (params) => {
  return axios.request({
    method: 'post',
    data: qs.stringify(params, {
      serializeDate: (d) => {
        return formatDate(d, 'yyyy-MM-dd hh:mm:ss')
      }
    }),
    url: '/core/sys/reg/tenantNzRg'
  })
}

/**
 * 获取所有认证信息.
 */
export const getTenantCert = (id) => {
  return axios.request({
    method: 'post',
    data: qs.stringify({ id: id }),
    url: '/core/sys/tenant/cert/getTenantCert'
  })
}

// 验证手机号码唯一性
export const phoneOnlyOne = (params) => {
  return axios.request({
    method: 'post',
    data: qs.stringify(params),
    url: '/core/sys/tenant/phoneOnlyOne'
  })
}

// 验证账号唯一性
export const accountOnlyOne = (params) => {
  return axios.request({
    method: 'post',
    data: qs.stringify(params),
    url: '/core/sys/tenant/accountOnlyOne'
  })
}
