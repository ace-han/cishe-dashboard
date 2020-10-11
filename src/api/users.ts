import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { IUserData, IUserWithGroupData, ListResponse } from './types'

export const getUserInfo = (): Promise<IUserWithGroupData> => {
  return requestService.get<IUserWithGroupData>('/fev1/account/users/current-user-info/', {
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

export const getUsers = (params: any): Promise<AxiosResponse<ListResponse<IUserData|IUserWithGroupData>>> => {
  return requestService.get<ListResponse<IUserData|IUserWithGroupData>>('/fev1/account/users/', {
    params
  })
}
