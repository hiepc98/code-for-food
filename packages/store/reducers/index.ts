import { combineReducers } from 'redux'

import { sessionReducers } from './session'
import { storageReducers } from './storage'

export * from './session'
export * from './storage'

const rootReducer = combineReducers({
  ...sessionReducers,
  ...storageReducers
})

export default rootReducer
