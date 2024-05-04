import type { Wallet } from '@wallet/core'

import StepInform from '../components/CreateStep/Step.Inform'
import StepNaming from '../components/CreateStep/Step.Naming'
import StepPassphrase from '../components/CreateStep/Step.Passphrase'
import StepRestore from '../components/CreateStep/Step.Restore'
import StepVerify from '../components/CreateStep/Step.Verify'
import Wizard from '../components/CreateStep/Wizard'
import { CreateWalletProvider } from '../context/CreateWalletContext'
import { WalletType } from '../../../types'
import withI18nProvider from '../../../provider'

interface CreateWalletScreenProps {
  onImportWallet?: (wallet: Wallet) => void
  encryptService?: any
  baseAdapter: any
  type: WalletType
  // wallets: Wallet[]
}

 const CreateWalletScreen = ({
  // onImportWallet,
  encryptService,
  baseAdapter,
  type,
  // wallets,
}: CreateWalletScreenProps) => {
  const renderStep = () => {
    if (type === WalletType.Restore) {
      return (
        <Wizard className="h-full flex flex-col">
          <StepRestore />
          <StepNaming />
        </Wizard>
      )
    }

    return (
      <Wizard className="h-full flex flex-col">
        <StepInform />
        <StepPassphrase />
        <StepVerify />
        <StepNaming />
      </Wizard>
    )
  }

  return (
    <CreateWalletProvider
      // onImportWallet={onImportWallet}
      encryptService={encryptService}
      baseAdapter={baseAdapter}
      type={type}
      // wallets={wallets}
    >
      {renderStep()}
    </CreateWalletProvider>
  )
}

export default withI18nProvider(CreateWalletScreen)
