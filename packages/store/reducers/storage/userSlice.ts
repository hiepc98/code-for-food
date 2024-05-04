import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { PasswordType } from "../../types";

export enum NetworkType {
  Mainnet = "Mainnet",
  Testnet = "Testnet",
  Devnet = "Devnet",
}

export interface ITokenPayload {
  apiToken?: string;
  adapterToken?: string;
  verifyToken?: string;
}

export interface UserState {
  authentication: {
    // Prepare for future matrix password
    type?: PasswordType;
    password?: string;
    isLock: boolean;
    // Spam Token
    token?: string;
    // API Token
    apiToken?: string;
    adapterToken?: string;
    verifyToken?: string;
    lastActivity?: number;
    connections?: any;
    vault?: string;
  };
  network: NetworkType;
  deviceId: string;
}

export interface LockState {
  isLock: boolean;
  resetRetry?: boolean;
}

const initialState: UserState = {
  authentication: {
    type: "password",
    isLock: true,
    connections: [],
    token: '6746673561658773312250030278769981507596', // random to test
  },
  network: NetworkType.Mainnet,
  deviceId: null as any,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Authentication
    onLoginUser: (state, action: PayloadAction<string>) => {
      state.authentication.token = action.payload;
    },
    onUpdateToken: (state, action: PayloadAction<ITokenPayload>) => {
      state.authentication.apiToken = action.payload.apiToken;
      state.authentication.adapterToken = action.payload.adapterToken;
      state.authentication.verifyToken = action.payload.verifyToken;
    },
    onUpdateDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
    onUpdateAuthentication: (
      state,
      action: PayloadAction<{ type: PasswordType; password: string }>
    ) => {
      state.authentication.password = action.payload.password;
      state.authentication.type = action.payload.type;
      delete state.authentication.vault;
    },
    onChangeLockState: (state, action: PayloadAction<LockState>) => {
      const { isLock, resetRetry } = action.payload;

      state.authentication.isLock = isLock;
      if (resetRetry) {
        delete state.authentication.vault;
      }
    },

    onUpdateVault: (state, action) => {
      state.authentication.vault = action.payload;
    },
    onUpdateNetwork: (state, action: PayloadAction<NetworkType>) => {
      state.network = action.payload;
    },
    resetUserSlice: () => {
      return initialState;
    },
    onUpdateActivity: (state) => {
      state.authentication.lastActivity = new Date().getTime();
    },
  },
});

export const {
  onLoginUser,
  onUpdateToken,
  onUpdateDeviceId,
  onUpdateAuthentication,
  onChangeLockState,
  onUpdateVault,
  resetUserSlice,
  onUpdateNetwork,
  onUpdateActivity,
  // onUpdateNetworkSelected,
  // onRemoveAccess,
  // onChangeIntegrationNetwork
} = userSlice.actions;

export default userSlice.reducer;
