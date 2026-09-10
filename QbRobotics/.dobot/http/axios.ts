import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import dptConfig from '../../dpt.json'
import pluginConfig from '../../configs/Main.json'
import store from '@dobot/store'

const instance = axios.create()

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.AuthorizationToken = localStorage.getItem('AuthorizationToken') || ''
    return config
  },
  (err: AxiosError) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res
  },
  (err: AxiosError) => {
    return Promise.reject(err)
  }
)

export function request(config: AxiosRequestConfig, port?: number) {
  const { portData, pluginPort } = store.getState().toolReducer
  console.log('pluginPort', pluginPort, portData, port, pluginPort)
  const options: AxiosRequestConfig = {
    ...config,
    withCredentials: true,
    baseURL: `http://${portData.ip}:${port || pluginPort}/dobotPlus/${pluginConfig.name}_v${pluginConfig.version}`
  }

  if (process.env.NODE_ENV !== 'production') {
    options.baseURL = `/dobotPlus/${pluginConfig.name}_v${pluginConfig.version}`
  }

  return instance.request({
    ...options,
    method: 'post'
  })
}

export function getPluginPort() {
  const { portData } = store.getState().toolReducer
  return instance.request({
    baseURL: process.env.NODE_ENV !== 'production' ? `` : `http://${portData.ip || dptConfig.ip}:22001`,
    url: '/dobotPlus/getPorts',
    method: 'get'
  })
}

export default instance
