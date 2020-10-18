import requestService from '@/utils/request'
import { AxiosResponse } from 'axios'
import { DeleteResponse, ICustomerData, ListResponse } from './types'

export const getCustomers = (params: any): Promise<AxiosResponse<ListResponse<ICustomerData>>> => {
  return requestService.get<ListResponse<ICustomerData>>('/fev1/contract/customers/', {
    params
  })
}

export const createCustomer = (data: any): Promise<AxiosResponse<ICustomerData>> => {
  return requestService.post<ICustomerData>('/fev1/contract/customers/', data)
}

export const partialUpdateCustomer = (id: number, data: any): Promise<AxiosResponse<ICustomerData>> => {
  return requestService.patch<ICustomerData>(`/fev1/contract/customers/${id}/`, data)
}

export const deleteCustomers = (params: any): Promise<AxiosResponse<DeleteResponse>> => {
  return requestService.post<DeleteResponse>('/fev1/contract/customers/bulk-delete/', undefined, {
    params
  })
}
