import requestService from '@/utils/request'
import { IUserData } from './types'

export const getUsers = (params: any) =>
  requestService({
    url: '/fev1/account/users/',
    params
  })

export const getUserInfo = (): Promise<IUserData> => {
  return requestService.get<IUserData>('/fev1/account/users/current-user-info/', {
    params: {
      expand: 'groups'
    }
  }).then(({ data }) => {
    // don't do anything about the interceptor in request.response
    // console.info('getUserInfo, data: ', data)
    data.roles = []
    for (const group of data.groups) {
      data.roles.push(group.name)
    }
    return data
  })
}

export const getUserByName = (username: string) =>
  requestService({
    url: `/users/${username}`,
    method: 'get'
  })
