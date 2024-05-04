import { encryptService } from '@wallet/screen'
import type { WalletParams } from '@wallet/screen'
import CreateWalletScreen from '@wallet/screen/components/CreateWallet/screens/CreateWalletScreen'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { onImportWallet, useAppDispatch } from 'store'

import { BaseAdapter } from '~controllers/apis/BaseAPI'
// import { encryptService } from '~controllers/services/encryption'

const TestCreateWalletScreen = () => {
  const { t } = useTranslation()
  const { type } = useParams<WalletParams>()
  // const wallets = useAppSelector((state) => state.wallet.wallets)
  const dispatch = useAppDispatch()
  const onImportWalletDispatch = (wallet: any) => {
    dispatch(onImportWallet(wallet))
  }

  return (
    <CreateWalletScreen
      onImportWallet={onImportWalletDispatch}
      encryptService={encryptService}
      baseAdapter={BaseAdapter}
      type={type}
      t={t}
    />
  )
}

export default TestCreateWalletScreen
