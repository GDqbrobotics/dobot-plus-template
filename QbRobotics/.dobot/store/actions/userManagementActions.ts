export const userManagementActionsType = {
  SETUSERMODALDATA: 'setUserModalData',
  SET_PERMISSIONLIST: 'setPermissionList',
  SET_CURRENT_LEVEL: 'setCurrentLevel',
  SET_CURRENT_USER_INFO: 'setCurrentUserInfo'
}
class UserManagementActions {
  setUserModalData = (params: any) => ({
    type: userManagementActionsType.SETUSERMODALDATA,
    params
  })
  setPermissionList = (params: any) => ({
    type: userManagementActionsType.SET_PERMISSIONLIST,
    params
  })
  setCurrentLevel = (params: any) => ({
    type: userManagementActionsType.SET_CURRENT_LEVEL,
    params
  })
  setCurrentUserInfo = (params: any) => ({
    type: userManagementActionsType.SET_CURRENT_USER_INFO,
    params
  })
}
export const userManagementActions = new UserManagementActions()
