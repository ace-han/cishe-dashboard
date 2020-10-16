import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, IUserData, IUserWithGroupData, ListResponse } from './types'

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

export const getUsers = (params: any): Promise<AxiosResponse<ListResponse<IUserWithGroupData>>> => {
  return requestService.get<ListResponse<IUserWithGroupData>>('/fev1/account/users/', {
    params
  })
}

export const createUser = (data: any): Promise<AxiosResponse<IUserData>> => {
  return requestService.post<IUserData>('/fev1/account/users/', data)
}

export const partialUpdateUser = (id: number, data: any): Promise<AxiosResponse<IUserData>> => {
  return requestService.patch<IUserData>(`/fev1/account/users/${id}/`, data)
}

export const deleteUsers = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/account/users/bulk-delete/', undefined, {
    params
  })
}

export const updateUserPassword = (id: number, password: string): Promise<AxiosResponse<{}>> => {
  return requestService.post<{}>(`/fev1/account/users/${id}/password/`, {
    data: {
      password
    }
  })
}
