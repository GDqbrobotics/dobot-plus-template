import React from 'react'
import './entry.css'
import { createRoot } from 'react-dom/client'
import { Card, Space } from 'antd'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <div className="container">
        <h2>Plugin Page</h2>
        <Space>
          <Card
            title={
              <Space>
                <span>Toolbar Menu Page</span>
                <a href="/Toolbar/toolbar.html">GoTo</a>
              </Space>
            }
          >
            <div className="iframe-container">
              <iframe src="/Toolbar/toolbar.html"></iframe>
            </div>
          </Card>
          <Card
            title={
              <Space>
                <span>Main Control Page</span>
                <a href="/Main">GoTo</a>
              </Space>
            }
          >
            <div className="iframe-container">
              <iframe src="/Main"></iframe>
            </div>
          </Card>
        </Space>
      </div>
    </React.StrictMode>
  )
}
