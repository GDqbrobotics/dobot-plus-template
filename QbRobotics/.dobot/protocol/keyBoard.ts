import { isInIframe } from '@dobot/utils/tool'
import keyboardLink from 'keyboard-link'
if (!isInIframe) {
  const ws = new WebSocket('ws:127.0.0.1:10086')
  ws.onopen = () => {
    console.log('链接成功')
    ws.close()

    new keyboardLink({
      host: 'ws:127.0.0.1',
      port: 10086
    })
  }

  ws.onerror = () => {
    console.log('链接失败')
  }
}
