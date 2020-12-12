import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, ITakeOverData, ListResponse } from './types'

export const getTakeOvers = (params: any): Promise<AxiosResponse<ListResponse<ITakeOverData>>> => {
  return requestService.get<ListResponse<ITakeOverData>>('/fev1/contract/takeovers/', {
    params
  })
}

export const deleteTakeOvers = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/contract/takeovers/bulk-delete/', undefined, {
    params
  })
}

export const createTakeOver = (data: any): Promise<AxiosResponse<ITakeOverData>> => {
  return requestService.post<ITakeOverData>('/fev1/contract/takeovers/', data)
}
