import { combineReducers } from 'redux'
import toolReducer from './toolReducer'
import userManagementReducer from './userManagementReducer'

export default combineReducers({
  toolReducer,
  userManagementReducer
})
