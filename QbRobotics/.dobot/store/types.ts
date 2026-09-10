export interface IStoreState {
  toolReducer: ToolState
  userManagementReducer: UserManagementState
}

export interface ICapacityData {
  totalPallet: number
  totalBox: number
  timeHour: number
  timeMin: number
  timeSec: number
}

export interface IPalletRunningData {
  status: number
  layer: number
  box: number
}

export interface ParamsStyle {
  x: number
  y: number
  // 0：默认；1：旋转90
  rotate: number
  connection: number // 0：单吸 1：双吸（长边对齐） 2：双吸（短边对齐）
}

export interface ItemPreviewParams {
  boxCount: number
  pallet: {
    length: number
    width: number
    height: number
  }
  box: {
    length: number
    width: number
    height: number
    weight: number
  }
  style:
    | {
        typeA: ParamsStyle[]
        typeB: ParamsStyle[]
      }
    | {
        typeC: ParamsStyle[]
        typeD: ParamsStyle[]
      }
  layer: {
    count: number
    order: number[]
    partition: number
    partitionHeight: number
  }
  coordinate: {
    user: Array<number>
    tool: number
  }
}

export interface PreviewParamsData {
  conveyer?: number
  suction?: number
  lift?: number
  left?: ItemPreviewParams
  right?: ItemPreviewParams
}
export interface PointType {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
}
export interface caliPointType {
  imageX: number
  imageY: number
  physicalX: number
  physicalY: number
  angle: number
}
export interface ToolState {
  portData: {
    ip: string
    port: string
    isSync: boolean
  }
  tcpStatus: boolean
  tcpInfo: any
  extendIoData: any[]
  onRobotTool: string[]
  deviceStateData: DeviceState
  ioData: any
  pluginPort: string
  dobotplusHost: string
  ioList: {
    input: {
      address: number
      diValue: number
      editName: string
      init: string
      isShow: boolean
      name: string
      value: number
    }[]
    output: {
      address: number
      editName: string
      init: string
      isShow: boolean
      name: string
      value: number
    }[]
  }
  pointData: any[]
  jogInPaused: boolean
  isAutoIdentify: boolean
}

export type DeviceState = {
  dragTeach?: {
    status: boolean
    mode: number
    direction: boolean[]
    custom?: boolean[]
  }
  isTimeout?: boolean
  stateL?: boolean
  pose: {
    joints: number[]
    axes: number[]
    auxJoint: number[]
    l: number
    rdnCoordinate?: number[]
  }
  alarm: number[][]
  alarmGo: number[]
  hht: {
    isEnabled: string
  }
  safeGuardMode?: 0 | 1 | 2
  batteryVoltage?: number
  batteryStatus?: 0 | 1
  moveSpeed?: {
    x: number
    y: number
    r: number
  }
  position?: {
    x: number
    y: number
    yaw: number
  }
  joyState?: boolean
  controlMode: number
  isCollision?: boolean
  skinCollison?: boolean

  remoteControl?: remoteControlType
  cameraModel?: {
    arm: number
    car: number
  }
  inputs?: number[]
  outputs?: number[]
  endDI?: number[]
  endDO?: number[]
  gpioAO?: number[]
  extendDO?: number[][]
  extendDI?: number[][]
  ioAI?: number[]
  endAI?: number[]
  prjState?: PrjStateType
  powerState?: boolean
  detailsInfo?: {
    controlParams: number[]
    jointCurrent: number[]
    jointVoltage: number[]
    jointTemp: number[]
  }
  dragMode?: boolean // 拖拽状态
  isSafeRun?: number
  isSafeSuspend?: number
  safeDO?: number[]
  safeDI?: number[]
  selectedControlBarCoordinate: {
    user: number
    tool: number
  }
  jogMode: JogMode
  dragPlayback?: boolean // 复现状态
  dragTrack?: boolean // 录制状态
  autoManual?: 'auto' | 'manual'
  emergencyStop?: boolean
  warning?: number
  speedRatio?: number
  remoteRun?: boolean
  jointBrake?: number[]
  coordinate?: CoordinateType
  pointSignal?: number
  ledStatus?: number
  skinValue?: number[]
}

export enum RemoteModeType {
  Online = 'tp',
  TCP = 'tcp'
}
export type remoteControlType = {
  mode: RemoteModeType
  name: string
}
export enum PrjStateType {
  stopped = 'stopped',
  suspended = 'suspended',
  running = 'running'
}
export enum JogMode {
  Jog = 'jog',
  Step = 'step'
}
export enum CoordinateType {
  Cartesian = 'cartesian',
  Joint = 'joint',
  Tool = 'tool'
}
export interface UserManagementState {
  userModalData: {
    show: boolean
    edit?: boolean
    user?: any
    index?: number
  }
  permissionList: any[]
  currentLevel: number
  currentUserInfo: string
}

export enum ModuleType {
  Module = 'Module',
  Template = 'Template'
}
