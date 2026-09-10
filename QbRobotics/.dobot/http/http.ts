
import { AxiosResponse } from 'axios'
import { request } from './axios'


export const PingDevice = (data: any) => {
  return request({
    url: 'PingDevice',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const SetControlMode = (data: any) => {
  return request({
    url: 'SetControlMode',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const SetMotorEnabled = (data: any) => {
  return request({
    url: 'SetMotorEnabled',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const SetTarget = (data: any) => {
  return request({
    url: 'SetTarget',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const GetPosition = (data: any) => {
  return request({
    url: 'GetPosition',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const GetCurrent = (data: any) => {
  return request({
    url: 'GetCurrent',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}


export const GetSerialNumber = (data: any) => {
  return request({
    url: 'GetSerialNumber',
    method: 'post',
    data: data ? [{ ...data }] : []
  }) as Promise<AxiosResponse<[{ status: boolean; data: any }]>>
}

