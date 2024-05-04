// import { encryptService } from '@wallet/screen'
import type { Wallet } from '@wallet/core'
import PasswordScreen from '@wallet/screen/components/Auth/screens/PasswordScreen'
import { useLocation, useParams } from 'react-router-dom'
import { onChangeLockState, onMigrateWallet, onUpdateActivity, onUpdateAuthentication, useAppDispatch, useAppSelector } from 'store'

const TestPasswordScreen = () => {
  const dispatch = useAppDispatch()
  const { type } = useParams<any>()
  const { state: locationState } = useLocation<any>()
  const [isInitialized, wallets] = useAppSelector((state) => {
    return [!!state.user.authentication.password, state.wallet.wallets]
  })

  const handleChangeLockState = (status: boolean) => {
    dispatch(onChangeLockState(status as any))
  }

  const handleUpdateActivity = () => {
    dispatch(onUpdateActivity())
  }

  const handleUpdateAuthentication = (data: any) => {
    dispatch(onUpdateAuthentication(data))
  }

  const handleMigrateWallet = (wallets: Wallet[]) => {
    dispatch(onMigrateWallet(wallets))
  }

  return (
    <PasswordScreen
      wallets={wallets}
      type={type}
      isInitialized={isInitialized}
      isSizeExtension={locationState?.isSizeExtension}
      onChangeLockState={handleChangeLockState}
      onUpdateActivity={handleUpdateActivity}
      onUpdateAuthentication={handleUpdateAuthentication}
      onMigrateWallet={handleMigrateWallet}
    />
  )
}

export default TestPasswordScreen
