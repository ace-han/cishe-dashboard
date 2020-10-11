import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, IGroupData, IGroupWithUserData, ListResponse } from './types'

export const getGroups = (params: any): Promise<AxiosResponse<ListResponse<IGroupWithUserData>>> => {
  return requestService.get<ListResponse<IGroupWithUserData>>('/fev1/account/groups/', {
    params
  })
}

export const createGroup = (data: any): Promise<AxiosResponse<IGroupData>> => {
  return requestService.post<IGroupData>('/fev1/account/groups/', data)
}

export const partialUpdateGroup = (id: number, data: any): Promise<AxiosResponse<IGroupData>> => {
  return requestService.patch<IGroupData>(`/fev1/account/groups/${id}/`, data)
}

export const deleteGroups = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/account/groups/bulk-delete/', undefined, {
    params
  })
}
