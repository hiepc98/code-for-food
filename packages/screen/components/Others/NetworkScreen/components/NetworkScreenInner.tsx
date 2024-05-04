import type { Chain, Wallet } from '@wallet/core'
import { Icon, Input, ListItem } from '@wallet/ui'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  onActiveWallet,
  onSelectNetwork,
  useAppDispatch,
  useAppSelector
} from 'store'

// import { DefaultNetworks } from '~config/networks'
// import type { RamperWallet } from '~controllers/core/wallet'
import useTheme from '../../../../hooks/useTheme'
import { DefaultNetworks } from 'store/constants'
import withI18nProvider from '../../../../provider'
// import {
//   useAppDispatch,
//   useAppSelector
// } from '~controllers/stores/configureStore'
// import { onSelectNetwork } from '~controllers/stores/reducers/storages/settingSlice'
// import { onActiveWallet } from '~controllers/stores/reducers/storages/walletSlice'

interface NetworkScreenInnerProps {
  onClose: () => void
  handleSelectNetwork?: (network: Chain) => void
  networkSelected?: Chain
}

const NetworkScreenInner = (props: NetworkScreenInnerProps) => {
  const { onClose, handleSelectNetwork, networkSelected = null } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { isDarkTheme } = useTheme()

  const [activeNetwork] = useAppSelector((state) => [
    state.setting.activeNetwork
  ])
  const [activeWallet, walletsByUser] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.wallet.walletsByUser
  ])

  const [listNetwork, setListNetwork] = useState(DefaultNetworks)
  const [activeNetworkInner, setActiveNetworkInner] = useState<Chain>(null)

  useEffect(() => {
    if (networkSelected) {
      setActiveNetworkInner(networkSelected)
    } else {
      setActiveNetworkInner(activeNetwork)
    }
  }, [activeNetwork, networkSelected])

  const onChangeNetwork = (network: Chain) => () => {
    if (!network && !activeNetworkInner && !typeof handleSelectNetwork) return
    if (
      network &&
      network.chainId &&
      activeNetworkInner?.chainId &&
      network.chainId === activeNetworkInner?.chainId &&
      network.chain &&
      activeNetworkInner?.chain &&
      network.chain === activeNetworkInner?.chain
    ) {
      return
    }

    if (network && !!handleSelectNetwork) {
      handleSelectNetwork(network)
      onClose()
      return
    }

    if (network) {
      // set wallet by chain
      const walletsByNetwork: Wallet[] = walletsByUser[activeWallet.uid]
      const wallet = walletsByNetwork.find(
        (wallet) => wallet.meta.chain === network.chain
      )
      dispatch(onActiveWallet(wallet))
    }
    dispatch(onSelectNetwork(network))
    onClose()
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="h-4/5 overflow-auto">
        {listNetwork.map((network) => {
          const isActive = activeNetworkInner?.chain === network.chain
          return (
            <ListItem
              key={network.chain}
              image={network.logo}
              // symbol={network.logo}
              title={network.name}
              rightView={
                isActive && (
                  <Icon name="check" className="ml-auto text-h3 text-ui04" />
                )
              }
              onClick={onChangeNetwork(network)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default withI18nProvider(NetworkScreenInner)
