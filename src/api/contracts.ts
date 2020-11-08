import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, IContractDataWithDetail, ListResponse } from './types'

export const getContracts = (params: any): Promise<AxiosResponse<ListResponse<IContractDataWithDetail>>> => {
  return requestService.get<ListResponse<IContractDataWithDetail>>('/fev1/contract/contracts/', {
    params
  })
}

export const createContract = (data: any): Promise<AxiosResponse<IContractDataWithDetail>> => {
  return requestService.post<IContractDataWithDetail>('/fev1/contract/contracts/', data)
}

export const partialUpdateContract = (id: number, data: any): Promise<AxiosResponse<IContractDataWithDetail>> => {
  return requestService.patch<IContractDataWithDetail>(`/fev1/contract/contracts/${id}/`, data)
}

export const deleteContracts = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/contract/contracts/bulk-delete/', undefined, {
    params
  })
}
