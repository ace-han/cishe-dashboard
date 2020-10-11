export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
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
