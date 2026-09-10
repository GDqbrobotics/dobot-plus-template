import { ReactNode, useEffect, useRef, useState } from 'react'
import { MqttWebSocketClient } from '../utils/mqtt'
import dptConfig from '../../dpt.json'
import MainConfig from '../../configs/Main.json'
import { getPluginPort } from '@dobot/http/axios'
import '@dobot/protocol/methodsHandler'
import { toolActions } from '@dobot/store/actions/toolActions'
import store from '@dobot/store'
import { useSelector } from 'react-redux'
import { IStoreState, PrjStateType, RemoteModeType } from '@dobot/store/types'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import './styles/mask.css'

type BasicProps = {
  children: ReactNode
}

export type DobotPlusAppProps =
  | (BasicProps & {
      useMqtt: true
      topic?: string
      onMessage: (data: any) => void
      port?: number
    })
  | (BasicProps & {
      useMqtt?: false
    })

export function DobotPlusApp(props: DobotPlusAppProps) {
  const { children, useMqtt } = props
  const { portData } = useSelector((state: IStoreState) => state.toolReducer)
  const mqttConnected = useRef(false)
  const mqttClientRef = useRef<MqttWebSocketClient | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const pluginName = MainConfig.name
    const pluginVersion = MainConfig.version

    if (useMqtt) {
      const { topic, onMessage, port } = props

      const ip = process.env.NODE_ENV === 'production' ? portData.ip : dptConfig.ip
      const isDev = process.env.NODE_ENV === 'production' ? !mqttConnected.current && portData.isSync : true
      if (ip && onMessage && isDev) {
        const serverUrl = `ws://${ip}:${port || 8083}/mqtt`
        const clientId = `${pluginName}_clientId`
        const mqttClient = new MqttWebSocketClient(serverUrl, clientId)
        mqttClientRef.current = mqttClient
        mqttClient.connect()
        mqttClient.subscribe(topic || `${pluginName}Status`, (topic, buf) => {
          let data = {}
          try {
            data = JSON.parse(buf.toString())
          } catch {
            data = buf.toString()
          }
          onMessage(data)
        })
        mqttConnected.current = true
      }
    }

    getPluginPort()
      .then((res) => {
        const { data } = res
        const pluginKey = `${pluginName}_v${pluginVersion}`
        if (data) {
          console.log('pluginPorts', data)
          const pluginPort = data[pluginKey]
          if (!pluginPort) {
            setTimeout(() => {
              getPluginPort()
            }, 500)
          } else {
            store.dispatch(toolActions.setPluginPort(pluginPort))
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })

    return () => {
      if (mqttClientRef.current) {
        try {
          mqttClientRef.current.disconnect()
        } catch (e) {
          console.warn('mqtt disconnect error', e)
        }
        mqttClientRef.current = null
      }
      mqttConnected.current = false
    }
  }, [portData.isSync, useMqtt])

  const [forbidden, setForbidden] = useState(false)
  const { isAutoIdentify } = useSelector((state: IStoreState) => state.toolReducer)
  const prjState = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.prjState)
  const alarm = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.alarm)
  const dragPlayback = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.dragPlayback)
  const dragTrack = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.dragTrack)
  const dragMode = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.dragMode)
  const isDragTeach = useSelector((state: IStoreState) => state.toolReducer.deviceStateData.dragTeach?.status)
  const isTCP = useSelector(
    (state: IStoreState) => state.toolReducer.deviceStateData.remoteControl?.mode === RemoteModeType.TCP
  )

  function forbiddenClick() {
    if (isAutoIdentify) return message.warning(t('isAutoIdentifyTip'))
    // 机器报警，退出
    if (alarm && alarm.some((item) => item.length)) {
      return message.warning(t('alarmTip'))
    }
    if (prjState && prjState !== PrjStateType.stopped) {
      return message.warning(t('prjRunningTip'))
    }
    if (dragPlayback) {
      return message.warning(t('dragPlaybackTip'))
    }
    if (dragTrack) {
      return message.warning(t('dragTrackTip'))
    }
    if (dragMode) {
      return message.warning(t('dragModeTip'))
    }
    if (isDragTeach) {
      return message.warning(t('dragTeachTip'))
    }
    if (isTCP) {
      return message.warning(t('remoteControlTip'))
    }
    return true
  }

  useEffect(() => {
    if (prjState && prjState !== PrjStateType.stopped) {
      return setForbidden(true)
    }
    if (isAutoIdentify) {
      return setForbidden(true)
    }
    if (dragPlayback) {
      return setForbidden(true)
    }
    if (dragTrack) {
      return setForbidden(true)
    }
    if (dragMode) {
      return setForbidden(true)
    }
    if (isDragTeach) {
      return setForbidden(true)
    }
    if (isTCP) {
      return setForbidden(true)
    }
    if (alarm && alarm.some((item) => item.length)) {
      return setForbidden(true)
    }
    setForbidden(false)
  }, [prjState, dragPlayback, dragTrack, dragMode, isDragTeach, isAutoIdentify, alarm, isTCP])

  return (
    <>
      {children}
      {forbidden && <div className="mask" onClick={forbiddenClick}></div>}
    </>
  )
}
