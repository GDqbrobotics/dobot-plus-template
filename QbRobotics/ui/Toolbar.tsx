
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Form,
  InputNumber,
  Radio,
  Row,
  Slider,
  Space,
  Statistic,
  Switch,
  Tag,
  Typography,
  message
} from 'antd'
import { http, DobotPlusApp } from '@dobot/index'

const { Title } = Typography

type DeviceType = 'SHR' | 'CLAW' | 'SHIN'

function App() {
  const [form] = Form.useForm()
  const [deviceName, setDeviceName] = useState<string>('Unknown')
  const [position, setPosition] = useState<number>(0)
  const [current, setCurrent] = useState<number>(0)
  const [serialNumber, setSerialNumber] = useState<string>('Unknown')
  const [controlMode, setControlMode] = useState<string>('Position')
  const [target, setTarget] = useState<number>(0)
  const [deviceType, setDeviceType] = useState<DeviceType>('SHR')
  const [motorEnabled, setMotorEnabled] = useState<boolean>(false)

  const refreshStatus = async () => {
    try {
      const pingRes = await http.PingDevice({})
      const pingData = pingRes?.data?.[0]?.data
      if (typeof pingData === 'string' && pingData.length > 0) setDeviceName(pingData)

      const positionRes = await http.GetPosition({})
      const positionData = positionRes?.data?.[0]?.data
      if (typeof positionData === 'number') setPosition(positionData)

      const currentRes = await http.GetCurrent({})
      const currentData = currentRes?.data?.[0]?.data
      if (typeof currentData === 'number') setCurrent(currentData)

      const serialRes = await http.GetSerialNumber({})
      const serialData = serialRes?.data?.[0]?.data
      if (typeof serialData === 'string' && serialData.length > 0) setSerialNumber(serialData)
    } catch (error) {
      console.error('Status load failed:', error)
    }
  }

  useEffect(() => {
    refreshStatus()
  }, [])

  const handleMessage = (msg: Record<string, unknown>) => {
    if (msg && typeof msg.pingDevice === 'string') setDeviceName(msg.pingDevice)
    if (msg && typeof msg.position === 'number') setPosition(msg.position)
    if (msg && typeof msg.current === 'number') setCurrent(msg.current)
    if (msg && typeof msg.serialNumber === 'string') setSerialNumber(msg.serialNumber)
  }

  const callDevice = async (
    method: 'PingDevice' | 'SetControlMode' | 'SetMotorEnabled' | 'SetTarget' | 'GetPosition' | 'GetCurrent' | 'GetSerialNumber',
    payload: Record<string, unknown>,
    successText: string
  ) => {
    try {
      const response = await http[method](payload)
      const data = response?.data?.[0]?.data

      if (data === false || data === undefined || data === null) {
        message.error('Command failed')
        return false
      }

      message.success(successText)
      return true
    } catch (error) {
      console.error(error)
      message.error('Command failed')
      return false
    }
  }

  const handlePing = async () => {
    const ok = await callDevice('PingDevice', {}, 'Ping device')
    if (ok) await refreshStatus()
  }

  const handleSetControlMode = async () => {
    const ok = await callDevice('SetControlMode', { controlMode }, 'Control mode updated')
    if (ok) setControlMode(controlMode)
  }

  const handleToggleMotor = async (enabled: boolean) => {
    const ok = await callDevice('SetMotorEnabled', { enabled }, enabled ? 'Motor enabled' : 'Motor disabled')
    if (ok) setMotorEnabled(enabled)
  }

  const handleSetTarget = async () => {
    const ok = await callDevice('SetTarget', { target, deviceType }, 'Target updated')
    if (ok) setTarget(target)
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0047bb', controlHeight: 40 } }}>
      <DobotPlusApp useMqtt={true} onMessage={handleMessage}>
        <Flex vertical gap={16} style={{ padding: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            QbRobotics SoftHand Control
          </Title>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Device Status">
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Statistic title="Device" value={deviceName} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Position" value={position} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Current" value={current} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Serial Number" value={serialNumber} />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Flex vertical gap={16}>
                <Card title="Control">
                  <Form layout="vertical" form={form}>
                    <Form.Item>
                      <Space>
                        <Button type="primary" onClick={handlePing}>Ping Device</Button>
                        <Button type="primary" onClick={() => handleToggleMotor(!motorEnabled)}>
                          {motorEnabled ? 'Disable Motor' : 'Enable Motor'}
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>

                <Card title="Parameters">
                  <Form layout="vertical" form={form}>
                    <Form.Item label="Control Mode">
                      <Radio.Group
                        value={controlMode}
                        onChange={(e) => setControlMode(e.target.value)}
                        options={[
                          { label: 'Position', value: 'Position' },
                          { label: 'Current', value: 'Current' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Device Type">
                      <Radio.Group
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                        options={[
                          { label: 'SHR', value: 'SHR' },
                          { label: 'CLAW', value: 'CLAW' },
                          { label: 'SHIN', value: 'SHIN' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Target">
                      <Row gutter={12} align="middle">
                        <Col span={18}>
                          <Slider min={0} max={100} value={target} onChange={setTarget} />
                        </Col>
                        <Col span={6}>
                          <InputNumber min={0} max={100} value={target} onChange={(value) => setTarget(Number(value || 0))} />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item label="Motor Enabled">
                      <Switch checked={motorEnabled} onChange={handleToggleMotor} />
                    </Form.Item>

                    <Form.Item>
                      <Space>
                        <Button type="primary" onClick={handleSetControlMode}>Apply Mode</Button>
                        <Button type="primary" onClick={handleSetTarget}>Apply Target</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </Flex>
            </Col>
          </Row>

          <Tag color="blue">Device State: {deviceName}</Tag>
        </Flex>
      </DobotPlusApp>
    </ConfigProvider>
  )
}

export default App
