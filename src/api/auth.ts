import request from '@/utils/request'

export const login = (data: any) =>
  request({
    url: '/fev1/auth/token',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/fev1/auth/token/delete',
    method: 'post'
  })

export const refresh = () =>
  request({
    url: '/fev1/auth/token/refresh',
    method: 'post'
  })
