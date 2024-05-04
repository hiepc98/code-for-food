import { configureStore } from '@reduxjs/toolkit'
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux'
// import logger from 'redux-logger'
import { localStorage } from 'redux-persist-webextension-storage'

import {
  // FLUSH,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
  // REHYDRATE,
  // RESYNC,
  persistReducer,
  persistStore
} from '@plasmohq/redux-persist'
import { Storage } from '@plasmohq/storage'

import rootReducer from './reducers'

export const persistConfig = {
  key: 'production',
  version: 1,
  storage: localStorage,
  debug: false
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
) as typeof rootReducer

const mockStore = configureStore({
  reducer: rootReducer
})

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [
      //     FLUSH,
      //     REHYDRATE,
      //     PAUSE,
      //     PERSIST,
      //     PURGE,
      //     REGISTER,
      //     RESYNC
      //   ]
      // },
      serializableCheck: false,
      immutableCheck: false
    })
})

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage({ area: 'local' }).watch({
  [`persist:${persistConfig.key}`]: () => {
    if (
      typeof window === 'undefined' ||
      (window && window.location.href.includes('background'))
    ) {
      console.log('resync')
      persistor.resync()
    }
  }
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof mockStore.getState>

export type AppDispatch = typeof mockStore.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch: () => AppDispatch = useDispatch
