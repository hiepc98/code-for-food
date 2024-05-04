import adapter from '@vespaiach/axios-fetch-adapter'
import { sleep } from '@wallet/utils'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import crypto from 'crypto-js'
import has from 'lodash/has'
import QueryString from 'query-string'
import get from 'lodash/get'

import { store, onUpdateToken } from '../index'
import { CHAIN_TYPE } from '../constants'

const DEFAULT_TIMEOUT = 120000
const SOURCE = process.env.PLASMO_PUBLIC_SOURCE || 'C98VICSGWLS'

// eslint-disable-next-line no-undef

export const WALLET_TYPE = {
  hot: 'hot',
  hybrid: 'hybrid',
}

export const BaseAPI = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_API,
  timeout: DEFAULT_TIMEOUT,
  adapter
})

const RequestInterceptor =
  (isAdapter: boolean) => (config: AxiosRequestConfig) => {
    const { apiToken, adapterToken } = store.getState().user.authentication

    const spamToken = process.env.PLASMO_PUBLIC_SPAM_TOKEN || ''

    const token = isAdapter ? adapterToken : apiToken

    config.headers = {
      os: 'extension',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Version: '1',
      Authorization: `Bearer ${token}`,
      Source: SOURCE,
      ...config.headers
    }

    // const signature = signaturizeRequest({})
    config.transformRequest = (data) => {
      let passwordHash

      if (config.method === 'post') {
        passwordHash = JSON.stringify(data || {})
        config.headers.signature = crypto.HmacSHA256(passwordHash, spamToken)
      }

      if (config.method === 'get') {
        passwordHash = QueryString.stringify(config.params || {})
      }

      config.headers.signature = crypto.HmacSHA256(passwordHash, spamToken)
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
    Authorization: 'Bearer token',
    Signature:
      'c26340d5243d802f03de751b9cbc049557ad0a14296aacf4a37dc7399adbe65c',
    Source: SOURCE
  }
})

export const InfoServiceAPI = axios.create({
  baseURL: process.env.PLASMO_PUBLIC_INFO_SERVICE_API,
  timeout: DEFAULT_TIMEOUT,
  adapter
})

export const BaseMessage = axios.create({
  baseURL: 'https://api-push.coin98.com/',
  timeout: DEFAULT_TIMEOUT,
  adapter,
})

BaseMessage.register = async ({deviceId, wallets, multichain, encrypted, hardwareWallet, kind, social, name, isCreate}) => {
  const isWatchOnly = false

  if (!isWatchOnly) {
    BaseMessage.post('address/register', {
      device: deviceId,
      wallets: wallets
        .filter((wl: any) => typeof get(wl, 'meta.chain') === 'string')
        .map((wl: any) => {
          return {
            address: get(wl, 'address'),
            chain: get(wl, 'meta.chain', CHAIN_TYPE.tomo)
          }
        }),
      information: {
        kind,
        social,
        encrypted,
        multichain,
        hardwareWallet,
        name,
        isCreate
      }
    })
  }
}


const URLS_RETURN_DATA = [
  // 'smartRouter/calculator',
  // 'smartRouter/callData',
  // 'smartRouter/fiat',
]

const ResponseInterceptor = (response) => {
  if (!response.data) {
    return Promise.reject(new Error('Data not found'))
  }
  const urlReturnData = URLS_RETURN_DATA.find(
    (url) => response.config?.url === url
  )

  if (urlReturnData) {
    return response?.data
  }

  if (response.data?.data) {
    return response.data?.data
  }

  return response.data
}

const renewToken = async () => {
  const { verifyToken } = store.getState().user.authentication

  const response: any = await BaseAdapter.post('user/renew', undefined, {
    headers: {
      verify: `Bearer ${verifyToken}`
    }
  })

  const { code, verify } = response

  store.dispatch(
    onUpdateToken({
      adapterToken: code,
      verifyToken: verify
    })
  )

  // sFunction.saveStorage(KEYSTORE.TOKEN_JWT, response.code)
  // sFunction.saveStorage(KEYSTORE.TOKEN_VERIFY, response.verify)
  // this.jwtToken = response.code
  // this.verifyToken = response.verify
}

const ErrorHandler = async (error) => {
  if (!error) {
    return Promise.reject(error)
  }

  if (error.response.status === 401) {
    await renewToken()
    await sleep(1000)

    const newConfig = Object.assign({}, error.config)
    const { apiToken, adapterToken } = store.getState().user.authentication

    const newToken = newConfig.headers?.isAdapter ? adapterToken : apiToken
    // Force request with new token
    newConfig.headers.Authorization = `Bearer ${newToken}`
    return BaseAdapter.request(newConfig)
  }

  if (has(error.response.data, 'data.errMess')) {
    return Promise.reject(error.response.data.data.errMess)
  }

  return Promise.reject('error')
}

BaseAdapter.interceptors.request.use(RequestInterceptor(true), ErrorHandler)
BaseAdapter.interceptors.response.use(ResponseInterceptor, ErrorHandler)

BaseAPI.interceptors.request.use(RequestInterceptor(true), ErrorHandler)
BaseAPI.interceptors.response.use(ResponseInterceptor, ErrorHandler)
