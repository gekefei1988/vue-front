import axios from '@/libs/api.request'

export const login = ({ userName, password, isConsoleLogin }) => {
  let loginUrl = 'login'
  if (isConsoleLogin) {
    loginUrl = 'login-console'
  }
  // 设置参数
  let params = {
    userName,
    password
  }
  let postParams = new URLSearchParams(params)
  return axios.request({
    url: loginUrl,
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
