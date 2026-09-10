import { userManagementActionsType } from '../actions/userManagementActions'
import { UserManagementState } from '@dobot/store/types'

const initialStore: UserManagementState = {
  userModalData: {
    show: false
  },
  permissionList: [
    [1, 'TR_LEVEL_1'],
    [2, 'TR_LEVEL_2'],
    [3, 'TR_LEVEL_3']
  ],
  currentLevel: 0,
  currentUserInfo: ''
}
const userManagementReducer = (state = initialStore, action: { type: string; params: any }) => {
  switch (action.type) {
    case userManagementActionsType.SETUSERMODALDATA: {
      return Object.assign({}, state, { userModalData: action.params })
    }
    case userManagementActionsType.SET_PERMISSIONLIST: {
      return Object.assign({}, state, { permissionList: action.params })
    }
    case userManagementActionsType.SET_CURRENT_LEVEL: {
      return Object.assign({}, state, { currentLevel: action.params })
    }
    case userManagementActionsType.SET_CURRENT_USER_INFO: {
      return Object.assign({}, state, { currentUserInfo: action.params })
    }
    default:
      return state
  }
}

export default userManagementReducer
