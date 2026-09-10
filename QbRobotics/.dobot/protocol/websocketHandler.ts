import i18n from '../utils/i18n'
import store from '../store'
import { toolActions } from '../store/actions/toolActions'
import { userManagementActions } from '../store/actions/userManagementActions'
import { communicator } from './postMessageCenter'

const url = `ws://localhost:8099`

export class WebSocketHandler {
  private ws: null | WebSocket
  private promiseObj: any
  private id: number
  private timerId: any
  private timeoutObj: any
  private timeout: number
  private serverTimeoutObj: null
  private isConnect: boolean
  private tryTimes: number

  constructor() {
    this.ws = null
    this.promiseObj = {}
    this.id = 0
    this.timerId = null
    this.timeout = 30000 //30秒发一次心跳
    this.timeoutObj = null
    this.serverTimeoutObj = null
    this.isConnect = false
    this.contentWs()
    this.tryTimes = -1
  }

  private contentWs = () => {
    if (this.isConnect || this.tryTimes > 3) return
    this.tryTimes += 1

    this.ws = new WebSocket(url)
    this.ws.onopen = () => {
      this.reset().start()
      this.isConnect = true
      ;(this.ws as WebSocket).onmessage = (data) => this.onSocketMessage(JSON.parse(data.data))
    }
    this.ws.onerror = () => {
      this.isConnect = false
      this.contentWs()
    }
    this.ws.onclose = () => {
      this.isConnect = false
      this.contentWs()
    }
  }

  private send = (params: { method: string; data: any }) => {
    const { data, method } = params
    const sendData = JSON.stringify({
      jsonrpc: '2.0',
      method,
      id: this.id,
      data
    })

    if (this.ws) this.ws.send(sendData)
    return new Promise((resolve) => {
      this.promiseObj[this.id] = resolve
      this.id++
    })
  }

  private onSocketMessage = (data: { id: number; method: string; result?: any; data?: any }) => {
    this.reset().start()
    this.id = data.id
    if (this.promiseObj[data.id]) {
      this.promiseObj[data.id](data.result || data.data)
      delete this.promiseObj[data.id]
    }
    if (data.method === 'heart') return
    this.messageHandler(data)
  }

  private reset() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj as any)
    return this
  }
  private start() {
    if (this.ws) {
      this.timeoutObj = setTimeout(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        this.send({ data: 'ping', method: 'heart' })
        // this.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
        //   this.ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        // }, this.timeout)
      }, this.timeout)
    }
  }

  private messageHandler = (data: any) => {
    let method = data.method
    if (method) {
      // 将 highlight_blocks 更改为 highlightBlocks 这样的驼峰样式
      method = method.replace(/_(\w)/g, (_: any, match: string) => match.toUpperCase()) + 'Handler'
      if ((this as any)[method]) {
        ;(this as any)[method](data)
      } else {
        throw `没有对应的 ${method} 处理方法, 请进行定义`
      }
    } else {
      console.error('不是自定义 message' + data)
    }
  }

  // *******************以下是WebSocket的响应接口********************

  // 初始化, 根据WS的消息调起
  private initHandler = (data: any) => {
    const deviceInfo = data.data
    if (deviceInfo) {
      store.dispatch(toolActions.setPortIp(deviceInfo.portName))
    }
  }
  private syncJogInPausedHandler = (event: MessageEvent) => {
    const data = event.data
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    store.dispatch(toolActions.setJogInPaused(data))
  }

  private syncIPAddressHandler = (data: any) => {
    const { ip } = data.data
    if (ip) {
      store.dispatch(toolActions.setPortIp(ip))
    }
  }

  private syncDeviceInfoHandler = (data: any) => {
    const { portName, deviceType, deviceName, cabinetType } = data.data
    const { portData } = store.getState().toolReducer
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

  // 同步语言
  private changeLocaleHandler = (data: any) => {
    const locale = data.data
    i18n.changeLanguage(locale.substr(0, 2))
  }
  syncExchangeHandler = (event: MessageEvent) => {
    const deviceStateData = event.data
    store.dispatch(toolActions.setDeviceStateData(deviceStateData))
  }

  dobotPlusBlockDataHandler = (event: MessageEvent) => {
    console.log('websocket dobotPlusBlockDataHandler', event)
    communicator.registerSource(JSON.parse(event.data).from, event.source, event.origin)
    const { data, locale, portName } = JSON.parse(event.data)
    store.dispatch(toolActions.setPortIp(portName))
    setTimeout(() => {
      PubSub.publish('dobotPlusBlockData', data)
    }, 1000)
    i18n.changeLanguage(locale.substr(0, 2))
  }

  resetDobotPlusBlockData = (data: any) => {
    console.log(data)
    communicator.send({
      method: 'resetDobotPlusBlockData',
      data,
      iframeName: 'alsontech',
      to: 'blockly'
    })
  }
  syncUserPermissionHandler = (event: MessageEvent) => {
    console.log('websocket syncUserPermissionHandler', event)
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    const level = JSON.parse(event.data)
    store.dispatch(userManagementActions.setCurrentLevel(level))
  }
  syncCreditCardInfoHandler = (event: MessageEvent) => {
    console.log('websocket syncCreditCardInfoHandler', event)
    communicator.registerSource(event.data.from || event.data.iframeName, event.source, event.origin)
    store.dispatch(userManagementActions.setCurrentUserInfo(String(event.data)))
  }
  dobotPlusLogout = () => {
    this.send({
      method: 'dobotPlusLogout',
      data: ''
    })
  }
  changeExitLoginTime = (time: any) => {
    this.send({
      method: 'changeExitLoginTime',
      data: time
    })
  }
  sendSkinState = (status: boolean) => {
    this.send({
      method: 'sendSkinState',
      data: status
    })
  }
  // dobot+应用通讯
  dobotplusQuit = async () => {
    await this.send({
      method: 'dobotplusQuit',
      data: {
        iframeName: 'dobotplusApp'
      }
    })
  }

  dobotplusCreateProject = async (path: string, projectData: any) => {
    return this.send({
      method: 'dobotplusCreateProject',
      data: { path, projectData }
    })
  }

  dobotplusWriteProject = async (path: string, projectData: any) => {
    return this.send({
      method: 'dobotplusWriteProject',
      data: { path, projectData }
    })
  }

  dobotplusDeleteProject = async (path: string) => {
    return this.send({
      method: 'dobotplusDeleteProject',
      data: { path }
    })
  }

  syncDobotPlusHostHandler = (data: any) => {
    if (!data.data) return
    store.dispatch(toolActions.setDobotplusHost(data.data))
  }

  syncIODataHandler = (event: MessageEvent) => {
    const ioData = JSON.parse(event.data)
    store.dispatch(toolActions.setIoData(ioData))
  }
}
