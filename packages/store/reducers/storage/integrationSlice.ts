import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IntegrationRequestType } from '@wallet/core'

//! Move Soon

// JsonRpcBase
interface ResponsePayload<T = any> {
  id: string
  response: T
}

interface IntegrationEvent {
  id: string | number
  name: string
  data: any
  origin?: string[]
}

export interface IntegrationState {
  requests: IntegrationRequestType[]
  events: IntegrationEvent[]
  currentMethod: string
}

const initialState: IntegrationState = {
  requests: [],
  events: [],
  currentMethod: ''
}

export const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    pushRequest: (state, action: PayloadAction<IntegrationRequestType>) => {
      state.requests = [action.payload, ...state.requests]
    },
    completeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload)
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload)
    },
    emptyRequest: (state) => {
      state.requests = []
    },
    updateResponse: (state, action: PayloadAction<ResponsePayload>) => {
      const { id, response } = action.payload
      const request = state.requests.find((req) => {
        return req.id === id
      })

      if (!request) return

      state.requests = [
        ...state.requests.filter((it) => it.id !== id),
        { ...request, response }
      ]
    },
    createOrUpdateEvent: (state, action: PayloadAction<IntegrationEvent>) => {
      const { name } = action.payload
      state.events = [
        ...(state.events || []).filter((ev) => ev.name !== name),
        action.payload
      ]
    },
    completeEvent: (state, action: PayloadAction<string | number>) => {
      state.events = state.events.filter((ev) => ev.id !== action.payload)
    },

    setCurrentMethod: (state, action) => {
      state.currentMethod = action.payload
    },

    resetIntegrationSlice: () => {
      return initialState
    }
  }
})

export const {
  pushRequest,
  removeRequest,
  emptyRequest,
  completeRequest,
  completeEvent,
  setCurrentMethod,
  updateResponse,
  resetIntegrationSlice,
  createOrUpdateEvent
} = integrationSlice.actions

export default integrationSlice.reducer
