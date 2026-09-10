import { DeviceState } from '@dobot/store/types'

export const TOOL_ACTIONS_TYPE = {
  SET_PORT_IP: 'setPortIp',
  SET_TCP_STATUS: 'setTcpStatus',
  SET_TCP_INFO: 'setTcpInfo',
  SET_EXTEND_IO_INDEX: 'setExtendIOData',
  SET_PORT: 'setPort',
  SET_ONROBOT_TOOL: 'setOnRobotTool',
  SET_DEVICE_STATE_DATA: 'setDeviceStateData',
  SET_PLUGIN_PORT: 'setPluginPort',
  SET_DOBOTPLUS_HOST: 'setDobotplusHost',
  SET_IO_DATA: 'setIoData',
  SET_POINT_DATA: 'setPointData',
  SET_JOG_IN_PAUSED: 'setJogInPaused',
  SET_DEVICE_INFO: 'setDeviceInfo'
}

class ToolActions {
  setPortIp = (params: string) => ({
    type: TOOL_ACTIONS_TYPE.SET_PORT_IP,
    params
  })
  setDeviceInfo = (params: any) => ({
    type: TOOL_ACTIONS_TYPE.SET_DEVICE_INFO,
    params
  })
  setTcpStatus = (params: any) => ({
    type: TOOL_ACTIONS_TYPE.SET_TCP_STATUS,
    params
  })
  setTcpInfo = (params: any) => ({
    type: TOOL_ACTIONS_TYPE.SET_TCP_INFO,
    params
  })
  setExtendIOData = (params: any) => ({
    type: TOOL_ACTIONS_TYPE.SET_EXTEND_IO_INDEX,
    params
  })
  setPort = (params: any) => ({
    type: TOOL_ACTIONS_TYPE.SET_PORT,
    params
  })
  setOnRobotTool = (params: string[]) => ({
    type: TOOL_ACTIONS_TYPE.SET_ONROBOT_TOOL,
    params
  })
  setDeviceStateData = (params: DeviceState) => ({
    type: TOOL_ACTIONS_TYPE.SET_DEVICE_STATE_DATA,
    params
  })
  setPluginPort = (params: DeviceState) => ({
    type: TOOL_ACTIONS_TYPE.SET_PLUGIN_PORT,
    params
  })
  setDobotplusHost = (params: string) => ({
    type: TOOL_ACTIONS_TYPE.SET_DOBOTPLUS_HOST,
    params
  })
  setIoData = (params: DeviceState) => ({
    type: TOOL_ACTIONS_TYPE.SET_IO_DATA,
    params
  })
  setPointData = (params: any[]) => ({
    type: TOOL_ACTIONS_TYPE.SET_POINT_DATA,
    params
  })
  setJogInPaused = (params: boolean) => ({
    type: TOOL_ACTIONS_TYPE.SET_JOG_IN_PAUSED,
    params
  })
}

export const toolActions = new ToolActions()
