import axios from '@/libs/api.request'
import { formatParams } from '@/libs/util'

// 权限验证
export const accessCheck = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    method: 'post',
    data: postParams,
    url: '/core/open-api/sys/shrio/access'
  })
}
