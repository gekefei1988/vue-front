import axios from '@/libs/api.request'

export const login = (params) => {
  let postParams = new URLSearchParams(params)
  return axios.request({
    url: 'login',
    data: postParams,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'get'
  })
}

// 获取用户信息
export const getUserInfo = (token) => {
  return axios.request({
    url: 'login/getUserInfo',
    params: {
      token
    },
    method: 'get'
  })
}
