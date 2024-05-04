import type { Wallet } from '@wallet/core'
import { encryptService } from '@wallet/screen'
import PasswordScreen from '@wallet/screen/components/Auth/screens/PasswordScreen'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { onChangeLockState, onMigrateWallet, onUpdateActivity, onUpdateAuthentication, useAppDispatch, useAppSelector } from 'store'
import type { TomoWallet } from 'store/types'

// import { encryptService } from 
// import {
//   useAppDispatch,
//   useAppSelector
// } from '~controllers/stores/configureStore'
// import {
//   onChangeLockState,
//   onUpdateActivity,
//   onUpdateAuthentication
// } from '~controllers/stores/reducers/storages/userSlice'
// import { onMigrateWallet } from '~controllers/stores/reducers/storages/walletSlice'

const TestPasswordScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { type } = useParams<any>()
  const { state: locationState } = useLocation<any>()
  const [isInitialized, wallets] = useAppSelector((state) => {
    return [!!state.user.authentication.password, state.wallet.wallets]
  })

  const handleChangeLockState = (status: boolean) => {
    dispatch(onChangeLockState(status))
  }

  const handleUpdateActivity = () => {
    dispatch(onUpdateActivity())
  }

  const handleUpdateAuthentication = (data: any) => {
    dispatch(onUpdateAuthentication(data))
  }

  const handleMigrateWallet = (wallets: TomoWallet[]) => {
    dispatch(onMigrateWallet(wallets))
  }

  return (
    <PasswordScreen
      t={t}
      wallets={wallets}
      type={type}
      isInitialized={isInitialized}
      isSizeExtension={locationState?.isSizeExtension}
      onChangeLockState={handleChangeLockState}
      onUpdateActivity={handleUpdateActivity}
      onUpdateAuthentication={handleUpdateAuthentication}
      onMigrateWallet={handleMigrateWallet}
      encryptService={encryptService}
    />
  )
}

export default TestPasswordScreen
