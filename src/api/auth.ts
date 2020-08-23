import request from '@/utils/request'

export const login = (data: any): Promise<any> => {
  return request({
    url: '/fev1/auth/token/',
    method: 'post',
    data
  })
}

export const logout = (): Promise<any> => {
  return request({
    url: '/fev1/auth/token/delete/',
    method: 'post'
  })
}

export const refresh = (): Promise<any> => {
  return request({
    url: '/fev1/auth/token/refresh/',
    method: 'post'
  })
}
