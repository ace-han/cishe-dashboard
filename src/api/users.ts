import request from '@/utils/request'

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = () => {
  return request({
    url: '/fev1/account/users/current-user-info/',
    method: 'get'
  }).then((data) => {
    console.info('getUserInfo, data: ', data)
    const user = data as any
    user.roles = user.groups
    return user
  })
}

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })
