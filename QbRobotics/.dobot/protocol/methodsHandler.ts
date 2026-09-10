import { PostMessageHandler } from './postMessageHandler'
import { WebSocketHandler } from './websocketHandler'
import './keyBoard'
import { isInIframe } from '@dobot/utils/tool'

let methodsHandler: any = undefined
const postMessageHandler = new PostMessageHandler()
// 根据环境判断
if (isInIframe) {
  methodsHandler = postMessageHandler
} else {
  methodsHandler = new WebSocketHandler()
}

export { methodsHandler, postMessageHandler }
