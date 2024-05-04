import type { TokenInfo } from '@wallet/core'
import { Button, Icon, Image, Input, MainLayout, TypeInput } from '@wallet/ui'
import { formatSeiDenomToAddress } from '@wallet/utils'
import get from 'lodash/get'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { lowerCase } from '../../../common/functions'
import useTheme from '../../../hooks/useTheme'
import useViewport from '../../../hooks/useViewport'

import AddTokenSuccessPopup from '../components/AddTokenSuccessPopup'
import { saveCustomTokens, useAppDispatch, useAppSelector } from 'store'
import withI18nProvider from '../../../provider'

interface IState {
  name: string
  symbol: string
}

const defaultTokenInfo = {
  name: '',
  symbol: ''
}

const AddCustomToken = () => {
  const { t } = useTranslation()
  const [errAddress, setErrAddress] = useState('')
  const [errURL, setErrURL] = useState({ text: '', state: false })
  const history = useHistory()
  // const { isDarkTheme } = useTheme()

  const timer = useRef(null)
  const [
    activeWallet,
    walletsByUser,
    customTokens,
    tokens,
    networks,
    activeNetwork
  ] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.wallet.walletsByUser,
    state.wallet.customTokens,
    state.wallet.tokens,
    state.setting.networks,
    state.setting.activeNetwork
  ])

  const [contractAddress, setContractAddress] = useState<string>()
  const [contractChain, setContractChain] = useState<string>()
  const [tokenState, setTokenState] = useState<IState>(defaultTokenInfo)
  const [tokenDecimals, setTokenDecimals] = useState<Number>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [iconUrl, setIconUrl] = useState('')
  const { isDarkTheme } = useTheme()
  const [networkSelected, setNetworkSelected] = useState(null)

  const { isExpand } = useViewport()

  const logoAllNetwork = isDarkTheme
    ? '/public/img/icons/all_networks_dark.svg'
    : '/public/img/icons/all_networks.svg'

  // const { getWalletByChain } = useWalletUser()

  // const activeService = useMemo(() => {
  //   if (!services) return []
  //   const chain = get(activeNetwork, 'chain', 'ether')
  //   return activeNetwork
  //     ? [services.wallet.getChainEngine(chain)]
  //     : services.wallet.engines
  // }, [activeNetwork, services])

  const listAllToken = useMemo(() => {
    const tokenList: any[] = []
    Object.keys(customTokens!).forEach((key) => {
      const tokens = customTokens[key]
      tokenList.push(...tokens)
    })
    return [...tokens, ...tokenList]
  }, [customTokens])

  const dispatch = useAppDispatch()

  const onChangeTokenState = (e) => {
    const { name, value } = e.target
    setTokenState((prev) => ({ ...prev, [name]: value }))
  }

  const onChangeTokenDecimals = (e) => {
    const { value } = e.target
    setTokenDecimals(value)
  }

  useEffect(() => {
    if (activeNetwork) {
      setNetworkSelected(activeNetwork)
    }
  }, [])

  useEffect(() => {
    if (!contractAddress) return
    getTokenInfoByAddress(contractAddress)
  }, [networkSelected])

  const getTokenInfoByAddress = async (address: string) => {
    if (!networkSelected) {
      setIsLoading(false)
      return setErrAddress(t('manage_token_screen.chain_validation'))
    }

    try {
      const chain = get(networkSelected, 'chain')
      // const walletByChain = getWalletByChain(chain)
      // let tokenInfo = {}

      const tokenInfo = await window.walletServices.getTokenInfo({
        chain,
        address,
        wallet: activeWallet // for cosmwasm
      })

      const info = {
        name: get(tokenInfo, 'name', ''),
        symbol: get(tokenInfo, 'symbol', '')
      }

      setTokenState(info)
      const tokenDecimal = tokenInfo.decimal
        ? get(tokenInfo, 'decimal', 6)
        : get(tokenInfo, 'decimals', 6)
      setTokenDecimals(tokenDecimal)
      setContractChain(get(tokenInfo, 'chain', 'tomo'))
    } catch (e) {
      setTokenState(defaultTokenInfo)
      setTokenDecimals(null)

      setErrAddress(t('manage_token_screen.token_not_found'))
    }

    setIsLoading(false)
  }

  const handleChangeIconUrl = (event) => {
    const { value } = event.target
    // eslint-disable-next-line prefer-regex-literals
    const regex = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    )
    const checkURL = regex.test(value)
    setIconUrl(value)

    if (!value) {
      return setErrURL({ text: '', state: false })
    }
    if (checkURL) {
      setErrURL({ text: '', state: false })
      return false
    } else {
      setErrURL({
        text: t('manage_token_screen.please_enter_a_url'),
        state: true
      })
      return false
    }
  }

  const onChangeAddress = async (event) => {
    setIsLoading(true)
    const { value } = event.target

    setContractAddress(value)

    if (!value) {
      setIsLoading(false)
      setTokenState(defaultTokenInfo)
      return setErrAddress('')
    }

    const isValidAddress = true
    clearTimeout(timer.current)

    if(isValidAddress) {
      timer.current = setTimeout(async () => {
        await getTokenInfoByAddress(value)
      }, 500)
      setErrAddress('')
    }
  }

  const handleValidateValue = (value: string, network: any) => {
    if (!value) return
    if (value && !network) {
      setIsLoading(false)
      return setErrAddress(t('manage_token_screen.chain_validation'))
    }

    const isError = listAllToken.some((item) => {
      const text = lowerCase(value.trim())
      const isChain = item.chain === network.chain
      const isAddress =
        lowerCase(item.address) === text || lowerCase(item.denom) === text
      return isChain && isAddress
    })

    setIsLoading(false)
    if (!isError) return setErrAddress('')

    return setErrAddress(t('custom_token.address_already_added'))
  }

  useEffect(() => {
    handleValidateValue(contractAddress!, networkSelected)
  }, [contractAddress])

  const handleAddToken = () => {
    let imageUrl = iconUrl || ''
    try {
      // if address string start with 'sei'
      let tokenInfo: any = tokenState
      if (tokenInfo !== defaultTokenInfo) {
        if (!imageUrl) {
          imageUrl = get(tokenInfo, 'image', '')
        } else {
          tokenInfo = {
            ...tokenInfo,
            image: imageUrl
          }
        }
      }
      // if (contractAddress && contractAddress.startsWith('sei')) {
      //   tokenInfo = {
      //     address: formatSeiDenomToAddress(contractAddress),
      //     denom: contractAddress,
      //     chain: 'sei',
      //     decimal: tokenDecimals,
      //     image: iconUrl,
      //     ...tokenState
      //   }
      // } else {
      //   tokenInfo = getTokenDetailByAddress(contractAddress, contractChain)
      //   if (!tokenInfo) {
      //     tokenInfo = {
      //       address: contractAddress,
      //       chain: contractChain,
      //       image: iconUrl,
      //       decimal: tokenDecimals,
      //       ...tokenState
      //     }
      //   }
      //   if (!imageUrl) {
      //     imageUrl = get(tokenInfo, 'image', '')
      //   } else {
      //     tokenInfo = {
      //       ...tokenInfo,
      //       image: imageUrl
      //     }
      //   }
      // }
      tokenInfo = {
        ...tokenInfo,
        address: contractAddress,
        decimal: tokenDecimals,
        chain: get(networkSelected, 'chain')
      }
      const customToken = {
        chain: contractChain,
        token: tokenInfo
      }
      dispatch(saveCustomTokens(customToken))
      window.openModal({
        type: 'none',
        title: t('custom_token.custom_token_added'),
        content: (
          <AddTokenSuccessPopup iconUrl={imageUrl} symbol={tokenState.symbol} t={t} />
        ),
        contentType: 'other',
        closable: true,
        onCancel: () => {
          history.replace('/main')
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // const handleSelectNetwork = (network) => {
  //   setErrAddress('')
  //   handleValidateValue(contractAddress, network)
  //   setNetworkSelected(network)
  // }

  // const openSelectNetwork = () => {
  //   window.openModal({
  //     type: 'none',
  //     title: t('main_screen.network'),
  //     content: (
  //       <div className="w-full h-full overflow-auto mt-20">
  //         <NetworkScreenInner
  //           onClose={() => window.closeModal()}
  //           handleSelectNetwork={handleSelectNetwork}
  //           networkSelected={networkSelected}
  //         />
  //       </div>
  //     ),
  //     contentType: 'other',
  //     closable: true
  //   })
  // }

  return (
    <MainLayout
      title={t('custom_token.add_custom_token')}
      className="px-5 pb-5 flex justify-between flex-col">
      <div
        className={`overflow-auto ${
          isExpand ? 'max-h-[558px]' : 'max-h-[458px]'
        }`}>
        {/* <div
          onClick={openSelectNetwork}
          className={`
            ${!networkSelected ? 'cursor-pointer' : 'cursor-pointer'}
            bg-ui01 mb-2 rounded-lg items-center p-3 leading-4 flex justify-between`}>
          <div className="flex items-center">
            <div className="relative h-[24px] w-[24px] all-center rounded-full bg-ui01 mr-3">
              <Image
                src={networkSelected ? networkSelected.logo : logoAllNetwork}
                className="w-full h-full object-cover rounded-full overflow-hidden bg-ui00"
              />
            </div>
            <div className="text-ui04">
              {get(networkSelected, 'name') || t('custom_token.select_chain')}
            </div>
          </div>

          <Icon className="text-h3 text-ui04 mr-1" name={'chevron_right'} />
        </div> */}

        <Input
          label={t('custom_token.contract_address_or_denom')}
          textarea
          rows={contractAddress ? 2 : 1}
          status={errAddress ? 'error' : 'normal'}
          caption={errAddress}
          value={contractAddress}
          onChange={onChangeAddress}
          placeholder={t('manage_token_screen.address_placeholder')}
          isPastable
          isAllowClear
        />
        <Input
          label={t('custom_token.name')}
          name="name"
          value={!errAddress ? tokenState.name : ''}
          placeholder={t('custom_token.token_name')}
          onChange={onChangeTokenState}
          maxLength={25}
        />
        <Input
          label={t('custom_token.symbol')}
          maxLength={10}
          name="symbol"
          value={!errAddress ? tokenState.symbol : ''}
          placeholder={t('manage_token_screen.abc')}
          onChange={onChangeTokenState}
        />
        <Input
          label={t('custom_token.decimals')}
          name="decimal"
          typeInput={TypeInput.Number}
          value={!errAddress ? (String(tokenDecimals || '')) : ''}
          placeholder={t('6')}
          // colorInput={getLength(String(tokenState.decimal)) === 0 && 'text-ui02'}
          maxNum={24}
          onChange={onChangeTokenDecimals}
          maxNumberDecimal={0}
        />

        <Input
          onChange={handleChangeIconUrl}
          value={iconUrl}
          placeholder={t('custom_token.icon_url_optional')}
          status={errURL.state ? 'error' : 'normal'}
          caption={errURL.text}
        />
      </div>

      <Button
        disabled={
          isLoading ||
          !contractAddress ||
          errAddress.length > 0 ||
          errURL.state ||
          !tokenState.symbol ||
          !tokenState.name
        }
        isLoading={isLoading}
        onClick={handleAddToken}>
        {t('custom_token.add')}
      </Button>
    </MainLayout>
  )
}

export default withI18nProvider(AddCustomToken)
