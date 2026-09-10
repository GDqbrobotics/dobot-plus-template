import { TOOL_ACTIONS_TYPE } from '../actions/toolActions'

const initialStore = {
  portData: {
    ip: '192.168.5.1',
    port: '22000',
    isSync: false,
    deviceType: '',
    deviceName: '',
    cabinetType: ''
  },
  tcpStatus: false,
  tcpInfo: [],
  extendIoData: [],
  onRobotTool: [],
  pluginPort: undefined,
  dobotplusHost: 'http://localhost:9889',
  deviceStateData: {
    prjState: 'stopped'
  },
  ioData: {},
  pointData: [],
  jogInPaused: false
}

const toolReducer = (state = initialStore, action: { type: string; params: any }) => {
  switch (action.type) {
    case TOOL_ACTIONS_TYPE.SET_PORT_IP: {
      return Object.assign({}, state, {
        portData: {
          ip: action.params,
          port: state.portData.port,
          isSync: true
        }
      })
    }
    case TOOL_ACTIONS_TYPE.SET_DEVICE_INFO: {
      return Object.assign({}, state, {
        portData: {
          ...state.portData,
          ...action.params
        }
      })
    }
    case TOOL_ACTIONS_TYPE.SET_PORT: {
      return Object.assign({}, state, {
        portData: {
          ip: state.portData.ip,
          port: action.params,
          isSync: true
        }
      })
    }
    case TOOL_ACTIONS_TYPE.SET_TCP_STATUS: {
      return Object.assign({}, state, { tcpStatus: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_TCP_INFO: {
      return Object.assign({}, state, { tcpInfo: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_EXTEND_IO_INDEX: {
      const newData = action.params.map((item: any) => {
        return {
          name: item.name,
          DONumber: item.doNumber,
          DOStart: item.doStart,
          DINumber: item.diNumber,
          DIStart: item.diStart
        }
      })
      return Object.assign({}, state, { extendIoData: newData })
    }
    case TOOL_ACTIONS_TYPE.SET_ONROBOT_TOOL: {
      return Object.assign({}, state, { onRobotTool: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_DEVICE_STATE_DATA: {
      return Object.assign({}, state, { deviceStateData: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_PLUGIN_PORT: {
      return Object.assign({}, state, { pluginPort: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_DOBOTPLUS_HOST:
      return Object.assign({}, state, { dobotplusHost: action.params })
    case TOOL_ACTIONS_TYPE.SET_IO_DATA: {
      return Object.assign({}, state, { ioData: action.params })
    }
    case TOOL_ACTIONS_TYPE.SET_POINT_DATA:
      return Object.assign({}, state, { pointData: action.params })
    case TOOL_ACTIONS_TYPE.SET_JOG_IN_PAUSED:
      return Object.assign({}, state, { jogInPaused: action.params })
    default:
      return state
  }
}

export default toolReducer
