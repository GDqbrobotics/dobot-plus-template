import mqtt from 'mqtt'
import type { MqttClient, IClientOptions } from 'mqtt'
export class MqttWebSocketClient {
  private client!: MqttClient
  private receiveMessageHandle!: (topic: string, msg: Buffer) => void
  private serverUrl: string
  private clientId: string
  private options: IClientOptions
  public constructor(serverUrl: string, clientId: string, options?: IClientOptions) {
    this.serverUrl = serverUrl
    this.clientId = clientId
    this.options = options || {}
  }

  //连接
  public connect(): void {
    this.client = mqtt.connect(this.serverUrl, {
      clientId: this.clientId,
      ...this.options
    })
    this.client.on('connect', this.onConnect)
    this.client.on('message', this.onMessage) //接收消息
    this.client.on('error', this.onError)
  }
  //断开连接
  public disconnect(): void {
    if (this.client) {
      this.client.end()
    }
  }

  // 订阅
  public subscribe(topic: string, receiveMessageHandle?: (topic: string, msg: Buffer) => void): void {
    if (this.client) {
      this.client.subscribe(topic)
      if (receiveMessageHandle) {
        this.receiveMessageHandle = receiveMessageHandle
      }
    }
  }
  //取消订阅
  public unsubscribe(topic: string): void {
    if (this.client) {
      this.client.unsubscribe(topic)
    }
  }
  // 发布消息
  public publish(topic: string, message: string | Buffer): void {
    if (this.client) {
      this.client.publish(topic, message)
    }
  }
  private onConnect = (): void => {}
  private onMessage = (topic: string, message: Buffer): void => {
    if (this.receiveMessageHandle) {
      this.receiveMessageHandle(topic, message)
    }
  }
  private onError = (error: Error): void => {
    console.log('连接错误：', error)
  }
}
