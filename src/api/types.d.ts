import { Moment } from 'moment'

interface IdObject {
  id?: number
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface ListResponse<T> {
  count: number
  next: string | null
  previous: string| null
  results: T[]
}

export interface DeleteResponse {
  detail: string
}

export interface IGroupData {
  id?: number
  name: string
}

export interface IUserData {
  id?: number
  username: string
  password?: string
  email: string
  'first_name': string
  'last_name': string
  'is_active': boolean
  'date_joined': string
  'last_login': string
}

export interface IUserWithGroupData extends IUserData {
  roles: string[] // usually pop from groups
  groups: IGroupData[]
}

export interface IGroupWithUserData extends IGroupData {
  users: IUserData[]
}

export interface ICustomerData {
  id?: number
  name: string
  'phone_num': string
  'phone_num2': string
  email: string
  'parent_phone_num': string
  'parent_type': string
  university: string
  department: string
  major: string
}

export interface IContractData extends IdObject {
  customer: number | ICustomerData
  'contract_num': string
  'contract_type': string
  source: string
  'signing_date': string
  'signing_branch': string
  'sale_agent': number | IUserData
  'probation_until': string
  'total_amount': number
  'referrer': string
  'supplementary_agreement': string
}

export interface IServiceInfoData {
  id?: number
  contract: number
  'enrollment_semester': string
  'retention_statement': string
  'target_country_code': string
  'target_subject': string
  'target_degree': string
  'target_major': string
  team: string
  workload: number
  status: string
  'start_date': string
  remark: string
}

export interface ITakeOverData {
  id?: number
  counselor: number | IUserData
  contract: number | IContractData
  'transfer_date': string
  remark: string
}

export interface IContractDataWithDetail extends IContractData {
  serviceinfo: IServiceInfoData
}

export interface ICommentData extends IdObject {
  'content_type': number
  'object_id': number
  comment: string
  'commented_by': string
  'commented_user': IUserData
  'submitted_at': string
  removed: boolean
}
