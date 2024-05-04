import withI18nProvider from '../../../provider'
import WrapSend from '../components/WrapSend'
import { SendTokenProvider } from '../context'

interface SendTokenScreenProps {
  // tokenAddress?: string
  // activeWallet: Wallet
  // customTokens?: Token[]
  // wallets: Wallet[]
  // addRecentContact: (data: RecentAddressState) => void
  // getRecentContactList: (wallet: Wallet) => any
  // fromScreen?: string
  encryptService?: any
}

const SendTokenScreen = ({
  encryptService // tokenAddress,
} // customTokens,
// fromScreen,
// wallets,
// addRecentContact,
// getRecentContactList
: SendTokenScreenProps) => {
  return (
    <SendTokenProvider
      encryptService={encryptService}
      // activeWallet={activeWallet}
      // addRecentContact={addRecentContact}
      // customTokens={customTokens}
      // fromScreen={fromScreen}
      // getRecentContactList={getRecentContactList}
      // tokenAddress={tokenAddress}
      // wallets={wallets}
    >
      <WrapSend />
    </SendTokenProvider>
  )
}

export default withI18nProvider(SendTokenScreen)
