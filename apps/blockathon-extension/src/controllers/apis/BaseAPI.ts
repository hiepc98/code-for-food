import adapter from '@vespaiach/axios-fetch-adapter'
import axios, { type AxiosRequestConfig } from 'axios'
import has from 'lodash/has'
import { store } from 'store'

const DEFAULT_TIMEOUT = 120000

export const BaseAPI = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_API,
  timeout: DEFAULT_TIMEOUT,
  adapter
})

const RequestInterceptor =
  (isAdapter: boolean) => (config: AxiosRequestConfig) => {
    config.headers = {
      os: 'extension',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Version: '1',
      Authorization: `Bearer token`,
      ...config.headers
    }

    config.transformRequest = (data) => {
      return JSON.stringify(data)
    }

    // Transform data before working with api
    return config
  }

export const BaseAdapter = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_ADAPTER,
  timeout: DEFAULT_TIMEOUT,
  adapter
})

export const InfoAPI = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_INFO_API,
  timeout: DEFAULT_TIMEOUT,
  adapter,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Version: '1',
    Authorization: `Bearer token`,
  }
})

export const InfoServiceAPI = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_INFO_SERVICE_API,
  timeout: DEFAULT_TIMEOUT,
  adapter
})


const ResponseInterceptor = (response) => {
  if (!response.data) {
    return Promise.reject(new Error('Data not found'))
  if (response.data?.data) {
    return response.data?.data
  }

  return response.data
}

const renewToken = async () => {
  const { verifyToken } = store.getState().user.authentication
}

const ErrorHandler = async (error) => {
  if (!error) {
    return Promise.reject(error)
  }

  if (error.response.status === 401) {
  }

  if (has(error.response.data, 'data.errMess')) {
    return Promise.reject(error.response.data.data.errMess)
  }

  return Promise.reject('error')
}
BaseAPI.interceptors.request.use(RequestInterceptor(true), ErrorHandler)
BaseAPI.interceptors.response.use(ResponseInterceptor, ErrorHandler)
