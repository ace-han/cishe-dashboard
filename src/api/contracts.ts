import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, IContractData, ListResponse } from './types'

export const getContracts = (params: any): Promise<AxiosResponse<ListResponse<IContractData>>> => {
  return requestService.get<ListResponse<IContractData>>('/fev1/contract/contracts/', {
    params
  })
}

export const createContract = (data: any): Promise<AxiosResponse<IContractData>> => {
  return requestService.post<IContractData>('/fev1/contract/contracts/', data)
}

export const partialUpdateContract = (id: number, data: any): Promise<AxiosResponse<IContractData>> => {
  return requestService.patch<IContractData>(`/fev1/contract/contracts/${id}/`, data)
}

export const deleteContracts = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/contract/contracts/bulk-delete/', undefined, {
    params
  })
}
