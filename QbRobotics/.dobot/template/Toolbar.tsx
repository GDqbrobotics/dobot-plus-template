import React from 'react'
import './index.scss'
import { Provider } from 'react-redux'
import store from '../store'
import App from '../../ui/Toolbar'
import '@dobot/utils/rem'
import '@dobot/utils/i18n'
import '@dobot-plus/components/dist/style.css'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}