import { jsonSafeParse } from "@dobot/utils/tool"

export class PostMessageCenter {
  dest: { [iframeName: string]: any }
  constructor() {
    this.dest = {}
  }
  send(message: any) {
    if (!message.iframeName) return
    const iframe = this.dest[message.to || message.iframeName]
    const origin = this.dest[`${message.to || message.iframeName}Origin`]
    if (!iframe || !origin) {
      throw 'please register source and origin firstly'
    }
    iframe.postMessage(message, origin)
  }
  listen(cb: Function) {
    window.addEventListener('message', event => {

      const data = jsonSafeParse(event.data)

      const iframeName = data.from || data.iframeName
      if (
        iframeName &&
        [
          'blockly',
          'DobotStudio2020',
          'dobotPlus',
          'dobotplusApp',
          'palleting3D'
        ].includes(iframeName)
      ) {
        cb(event)
      }
    })
  }
  public addDest = (
    iframeName: string,
    source: HTMLIFrameElement,
    iframeOrigin: string,
    origin: string
  ) => {
    this.dest[iframeName] = source
    this.dest[iframeOrigin] = origin
  }
  registerSource(iframeName: string, source: any, origin: string) {
    this.addDest(iframeName, source, `${iframeName}Origin`, origin)
  }
}
export const communicator = new PostMessageCenter()
