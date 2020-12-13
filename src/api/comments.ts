import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, ICommentData, ListResponse } from './types'

export const getComments = (params: any): Promise<AxiosResponse<ListResponse<ICommentData>>> => {
  return requestService.get<ListResponse<ICommentData>>('/fev1/comment/comments/', {
    params
  })
}

export const deleteComments = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/comment/comments/bulk-delete/', undefined, {
    params
  })
}

export const createComment = (data: any): Promise<AxiosResponse<ICommentData>> => {
  return requestService.post<ICommentData>('/fev1/comment/comments/', data)
}
