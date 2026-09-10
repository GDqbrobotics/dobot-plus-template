import { message } from 'antd'
import i18n from '../utils/i18n'
import store from '../store'
import { toolActions } from '../store/actions/toolActions'
import { communicator } from './postMessageCenter'
import PubSub from 'pubsub-js'
import { userManagementActions } from '../store/actions/userManagementActions'
import { jsonSafeParse } from '@dobot/utils/tool'

export class PostMessageHandler {
  constructor() {
    communicator.listen(this.listenCallback.bind(this))
  }
  private promiseId = 100
  private promisesMap: any = {}

  addPromises = (message: any, timeout: number = 1000) => {
    return new Promise((resolve) => {
      const promiseId = this.promiseId
      message['promiseId'] = promiseId
      communicator.send(message)
      setTimeout(() => {
        this.resolvePromise(promiseId, 'error')
      }, timeout)
      this.promisesMap[this.promiseId++] = resolve
    })
  }

  resolvePromise = (promiseId: number, resoveData?: any) => {
    const resolve = this.promisesMap[promiseId]
    if (resolve) {
      resolve(resoveData)
    }
  }

  listenCallback = (event: MessageEvent) => {
    const data = jsonSafeParse(event.data)
    let method = data.method

    if (method) {
      method = method.replace(/_(\w)/g, (_: any, match: string) => match.toUpperCase()) + 'Handler'
      if ((this as any)[method]) {
        ;(this as any)[method](event)
      } else {
        throw `没有对应的 ${method} 处理方法, 请在 util/postMessageCenter 中进行定义`
      }
    } else {
      console.error('不是自定义 message' + event)
    }
  }

  initHandler = (event: MessageEvent) => {
    const data = jsonSafeParse(event.data)
    communicator.registerSource(data.from || data.iframeName, event.source, event.origin)
    const deviceInfo = event.data.data
    if (deviceInfo) {
      store.dispatch(toolActions.setPortIp(deviceInfo.portName))
    }
  }

  syncJogInPausedHandler = (event: MessageEvent) => {
    communicator.registerSource(JSON.parse(event.data).from || event.data.iframeName, event.source, event.origin)
    const data = JSON.parse(event.data).data
    store.dispatch(toolActions.setJogInPaused(data))
  }
  syncIPHandler = (event: MessageEvent) => {
    communicator.registerSource(JSON.parse(event.data).from || event.data.iframeName, event.source, event.origin)
    const data = JSON.parse(event.data).data
    store.dispatch(toolActions.setPortIp(data.ip))
  }
  dobotPlusBlockDataHandler = (event: MessageEvent) => {
    communicator.registerSource(JSON.parse(event.data).from, event.source, event.origin)

    const data = JSON.parse(event.data).data
    const locale = JSON.parse(event.data).locale
    i18n.changeLanguage(locale.substr(0, 2))
    PubSub.publish('dobotPlusBlockData', data)
  }

  sendDobotPlusAlsonDataHandler = (event: MessageEvent) => {
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    const data = JSON.parse(event.data).data

    if (data === 'break') {
      message.success('断开连接')
      store.dispatch(toolActions.setTcpStatus(false))
    } else if (typeof data === 'object') {
      PubSub.publish('connectInfo', data)
      Object.keys(data).length === 0
        ? store.dispatch(toolActions.setTcpStatus(false))
        : store.dispatch(toolActions.setTcpStatus(true))
    } else if (data === 'err') {
      message.error('连接失败')
    } else if (data === 'close') {
    } else {
      data ? message.success('连接成功') : message.error('连接失败')
      store.dispatch(toolActions.setTcpStatus(data))
    }
  }
  dobotPlusAlsonTcpDataHandler = (event: MessageEvent) => {
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    const data = JSON.parse(event.data).data
    PubSub.publish('dobotPlusTcpData', data)
  }
  dobotPlusAlsonSendStatusHandler = (event: MessageEvent) => {
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    const data = JSON.parse(event.data).data
    PubSub.publish('sendStatus', data)
    if (data) {
      message.success('发送成功')
    } else {
      message.success('发送失败')
    }
  }
  resetDobotPlusBlockData = (data: any, iframeName?: any) => {
    console.log(data, iframeName)
    communicator.send({
      method: 'resetDobotPlusBlockData',
      data,
      iframeName: iframeName ? iframeName : 'alsontech',
      to: 'blockly'
    })
  }
  dobotPlusConnectTcp = (data: any) => {
    communicator.send({
      method: 'dobotPlusConnectTcp',
      data,
      iframeName: 'alsontech'
    })
  }
  changeLocaleHandler = (event: MessageEvent) => {
    console.log('changeLocaleHandler', event)
    const data = jsonSafeParse(event.data)
    communicator.registerSource(data.from || data.iframeName, event.source, event.origin)
    const locale = data.data
    i18n.changeLanguage(locale.substr(0, 2))
  }
  syncExchangeHandler = (event: MessageEvent) => {
    const data = jsonSafeParse(event.data)
    const deviceStateData = data.data
    store.dispatch(toolActions.setDeviceStateData(deviceStateData))
  }
  syncUserPermissionHandler = (event: MessageEvent) => {
    communicator.registerSource(JSON.parse(event.data).from || event.data.iframeName, event.source, event.origin)
    const level = JSON.parse(event.data).data
    store.dispatch(userManagementActions.setCurrentLevel(level))
  }
  syncCreditCardInfoHandler = (event: MessageEvent) => {
    communicator.registerSource(JSON.parse(event.data).from || event.data.iframeName, event.source, event.origin)
    const userInfo = JSON.parse(event.data).data
    store.dispatch(userManagementActions.setCurrentUserInfo(userInfo))
  }
  dobotPlusLogout = () => {
    communicator.send({
      method: 'dobotPlusLogout',
      iframeName: 'UserSetUp',
      to: 'DobotStudio2020'
    })
  }
  changeExitLoginTime = (time: any) => {
    communicator.send({
      method: 'changeExitLoginTime',
      data: time,
      iframeName: 'UserSetUp',
      to: 'DobotStudio2020'
    })
  }
  sendSkinState = (status: boolean) => {
    communicator.send({
      method: 'sendSkinState',
      data: status,
      iframeName: 'safeSkin',
      to: 'DobotStudio2020'
    })
  }

  // -------------------------------码垛-------------------------------------
  palleting3DInit = (window: any) => {
    window && communicator.registerSource('palleting3D', window, '*')
    const message = {
      method: 'palleting3DInit',
      iframeName: 'palleting3D'
    }
    communicator.send(message)
  }

  changeLocale = () => {
    const locale = i18n.language
    const message = {
      method: 'changeLocale',
      iframeName: 'palleting3D',
      data: locale
    }
    communicator.send(message)
  }

  setPalletingData = (palletingData: any) => {
    const message = {
      method: 'setPalletingData',
      data: palletingData,
      iframeName: 'palleting3D'
    }
    communicator.send(message)
  }

  setCameraViewKey = (key: string) => {
    const message = {
      method: 'setCameraViewKey',
      data: key,
      iframeName: 'palleting3D'
    }
    communicator.send(message)
  }

  // dobot+应用通讯
  dobotplusQuit = () => {
    communicator.send({
      method: 'dobotplusQuit',
      iframeName: 'dobotplusApp'
    })
  }

  dobotplusCreateProject = (path: string, projectData: any) => {
    return this.addPromises(
      {
        method: 'dobotplusCreateProject',
        data: { path, projectData },
        iframeName: 'dobotplusApp'
      },
      5000
    )
  }

  dobotplusCreateProjectHandler = (event: MessageEvent) => {
    console.log('dobotplusCreateProjectHandler', event)
    const { promiseId, data } = event.data
    this.resolvePromise(promiseId, data)
  }

  dobotplusWriteProject = (path: string, projectData: any) => {
    return this.addPromises(
      {
        method: 'dobotplusWriteProject',
        data: { path, projectData },
        iframeName: 'dobotplusApp'
      },
      5000
    )
  }

  dobotplusWriteProjectHandler = (event: MessageEvent) => {
    console.log('dobotplusWriteProjectHandler', event)
    const { promiseId, data } = event.data
    this.resolvePromise(promiseId, data)
  }

  dobotplusDeleteProject = (path: string) => {
    return this.addPromises(
      {
        method: 'dobotplusDeleteProject',
        data: { path },
        iframeName: 'dobotplusApp'
      },
      5000
    )
  }

  dobotplusDeleteProjectHandler = (event: MessageEvent) => {
    console.log('dobotplusDeleteProjectHandler', event)
    const { promiseId, data } = event.data
    this.resolvePromise(promiseId, data)
  }

  syncToolCoodinateDataHandler = () => {}
  syncUserCoodinateDataHandler = () => {}
  syncPointDataHandler = () => {}
  syncDeviceInfoHandler = (event: MessageEvent) => {
    let data = null
    try {
      data = JSON.parse(event.data)
    } catch (error) {
      data = event.data
    }
    const { portData } = store.getState().toolReducer
    const { deviceType, portName, deviceName, cabinetType } = data.data
    if (deviceType && portName && portData.deviceName !== deviceName) {
      store.dispatch(
        toolActions.setDeviceInfo({
          cabinetType,
          deviceType,
          deviceName
        })
      )
    }
  }
  syncIODataHandler = (event: MessageEvent) => {
    const ioData = JSON.parse(event.data).data
    store.dispatch(toolActions.setIoData(ioData))
  }
  updateBlocklyDataHandler = (event: MessageEvent) => {
    console.log('postmessage updateBlocklyData', event)
    const { data } = JSON.parse(event.data)
    console.log(data)

    store.dispatch(toolActions.setPointData(data.pointData))
  }
}
