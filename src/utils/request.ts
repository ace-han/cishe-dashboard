import axios, { AxiosError, AxiosResponse } from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'
import { UserModule } from '@/store/modules/user'

export interface DrfApiErrorData {
  detail: string
  code?: string
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

interface RefreshCallback {
  (okOnRefreshed: boolean): void
}

let isRefreshing = false
const subscribers: RefreshCallback[] = []

function subscribeTokenRefresh(cb: RefreshCallback): void {
  subscribers.push(cb)
}

function redirectLoginPage(): void {
  // otherwise if (UserModule.hasLoggedIn()) {} will shortcut redirect to `/login`
  // then an uncaught error `Redirected when going from "/home" to "/login" via a navigation guard.`
  UserModule.RESET()
  const next = `/login?redirect=${router.currentRoute.fullPath}`
  router.push(next)
}

function doRefreshToken(error: AxiosError): Promise<any> {
  const originalRequest = error.config
  // Expired access token or Invalid access token
  // refer to
  // https://github.com/konshensx16/vue-todo-frontend/blob/master/src/main.js
  if (!isRefreshing) {
    isRefreshing = true
    // using a new axios instance
    axios.request({
      url: '/api/fev1/auth/token/refresh/',
      method: 'POST',
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFTOKEN',
      timeout: 5000
    }).then(() => {
      subscribers.forEach((cb) => {
        const okOnRefreshed = true
        cb(okOnRefreshed)
      })
    }).catch(() => {
      Message.error('Login expired. Please login first.')
      subscribers.forEach((cb) => {
        const okOnRefreshed = false
        cb(okOnRefreshed)
      })
      redirectLoginPage()
    }).finally(() => {
      isRefreshing = false
    })
  }
  const requestSubscribers = new Promise((resolve, reject) => {
    subscribeTokenRefresh((okOnRefreshed) => {
      if (okOnRefreshed) {
        resolve(service(originalRequest))
      } else {
        reject(error)
      }
    })
  })

  return requestSubscribers
}

function doUnauthorizedMsgBox(error: AxiosError): Promise<any> {
  const { data } = error.response as AxiosResponse
  const { detail } = data as DrfApiErrorData
  const result = MessageBox.confirm(detail, 'Unauthorized access', {
    confirmButtonText: 'Login',
    cancelButtonText: 'Home Page'
  }).then(() => {
    redirectLoginPage()
  }).catch(() => {
    router.push('/')
  })
  return result
}

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    // if (UserModule.token) {
    //   config.headers['X-Access-Token'] = UserModule.token
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // will run after transformResponse
    // and response would be `any` at this time

    // It's 99% that just response.data in this project

    // If we want to change this behaviour,
    // please set `request.config.headers['X-Response-Style'] = 'Intact-Axios-Response'
    // then you will get a response as described in doc `AxiosResponse`
    // keep it as an AxiosResponse<any> or `any`
    // we just define two separate `AxiosInstance`s
    console.debug('interceptors.response', response)
    // If we do it like below, we will have to do request.get<any, ListResponse<SomeType>>(...)
    // `any` will be around everywhere as well, which is not good
    // why not go back to just `return response`
    // if (response.config.headers && response.config.headers['X-Response-Style'] === 'Intact-Axios') {
    //   return response
    // } else {
    //   return response.data
    // }
    return response
  },
  (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }

    const { config, data, status } = error.response as AxiosResponse
    const apiErrorData = data as DrfApiErrorData
    console.info('axios.interceptors.response.use onError', config)
    // const originalRequest = config
    let result

    switch (status) {
      case 403:
        if (apiErrorData.code) {
          // Expired access token or Invalid access token
          // do the refresh
          result = doRefreshToken(error)
        } else {
          // you do have NO permission for this api
          // popup a redirect dialog to navigation back to home or login page
          result = doUnauthorizedMsgBox(error)
        }
        break
      case 401:
        redirectLoginPage()
        result = Promise.reject<any>(error)
        break
      default:
        result = Promise.reject<any>(error)
    }
    return result
  }
)

export default service
