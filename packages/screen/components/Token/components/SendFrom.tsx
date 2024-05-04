/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon, Image, Input, TypeInput, BoxContent } from '@wallet/ui'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro,
  truncate,
  cx,
  getLength
} from '@wallet/utils'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useMemo } from 'react'

import { truncateText } from '../../../utils'
import {
  ADDRESS_TOKEN_GAS_FREE,
  ADDRESS_ZERO,
  DECIMALS_TOKEN_DISPLAY
} from '../../../constants'

import { useSendTokenContext } from '../context'
import ListToken, { type TypeListToken } from '../../shared/ListToken'
import ListWalletSelect from './ListWalletSelect'
import type { Wallet } from '@wallet/core'
import WalletAvatar from '../../shared/WalletAvatar'
import useViewport from '../../../hooks/useViewport'
import { useAppSelector } from 'store'
import GasSlider from '../../../components/shared/GasSlider'
import { useTranslation } from 'react-i18next'
import LoadingCircle from '../../shared/LoadingCircle'
import Loader from '../../shared/Loader'
import useTheme from '../../../hooks/useTheme'

interface IProps {
  isLoading?: boolean
  isLoadingGas?: boolean
  onChangeGas: (
    gasFee: number | undefined,
    gasPrice?: number | undefined
  ) => void
  errInput?: string
  isCustomGas?: boolean
  setIsCustomGas?: (value: boolean) => void
  setSendMaxOption: (value: boolean) => void
}

const SendFrom = (props: IProps) => {
  const {
    isLoading,
    isLoadingGas,
    errInput,
    isCustomGas,
    onChangeGas,
    setIsCustomGas,
    setSendMaxOption
  } = props

  const {
    tokenSelected,
    amount,
    walletSelected,
    listTokenSend,
    chain,
    gasFee,
    gasLimit,
    gasStep,
    gasDecimal,
    wallets,
    isGasFree,
    setIsGasFree,
    setAmount,
    setGasFee,
    setToAddress,
    onChangeWalletSelected,
    onInitalContactList,
    setRawAmount
  } = useSendTokenContext()

  const { t } = useTranslation()

  const [walletsByUser, activeWallet] = useAppSelector((state) => {
    return [state.wallet.walletsByUser, state.wallet.activeWallet]
  })

  const { isExpand } = useViewport()
  const { isDarkTheme } = useTheme()

  const decimal = get(tokenSelected, 'decimal')
  const feeTxsRaw = convertBalanceToWei('0', decimal)
  const balanceAvailable = useMemo(() => {
    const findTokenSelected = listTokenSend.find(
      (it) =>
        get(it, 'address', ADDRESS_ZERO) ===
        get(tokenSelected, 'address', ADDRESS_ZERO)
    )
    const rawBalance = findTokenSelected
      ? get(findTokenSelected, 'rawBalance', '0')
      : '0'
    const amountAvailable = parseFloat(rawBalance) - parseFloat(feeTxsRaw)
    if (amountAvailable <= 0) {
      return '0'
    }

    return amountAvailable.toString()
  }, [tokenSelected, walletSelected, listTokenSend])

  useEffect(() => {
    onInitalContactList?.()
  }, [])

  const initWalletSelected = (walletSelected?: Wallet) => {
    if (walletSelected) return onChangeWalletSelected?.(walletSelected)
    // const chain = get(tokenSelected, 'chain')
    // if (!chain) return
    // const wallet = getWalletByChain(chain)
  }

  const onSelectMaxBalance = (rawBalance: string) => () => {
    let amountAvailable = parseFloat(rawBalance)
    if (tokenSelected?.chain === chain) {
      amountAvailable = parseFloat(rawBalance) - parseFloat(feeTxsRaw)
    }

    const myAmount = convertWeiToBalance(amountAvailable.toString(), decimal)

    const formatAmount = String(formatNumberBro(myAmount, 4))

    setAmount?.(formatAmount)
    setRawAmount?.(myAmount)
    setSendMaxOption(true)
  }

  const onChangeInput = (event: any) => {
    const amountInput = event.target.value
    setAmount?.(amountInput)
    setRawAmount?.(amountInput)
    setSendMaxOption(false)
  }
  const handleSetWalletSelected = (v: Wallet) => {
    setAmount?.('')
    setToAddress?.('')
    initWalletSelected(v)
  }

  const resetAmount = () => {
    setAmount?.('')
    setToAddress?.('')
    setGasFee?.(0)
    setSendMaxOption(false)
  }

  const onOpenModalTokens = (type: TypeListToken) => () => {
    const renderTitle = type === 'send' ? 'Send Token' : 'Receive'
    window.openModal({
      type: 'none',
      title: t(renderTitle),
      content: (
        <ListToken
          type={type}
          listTokens={listTokenSend}
          doSelectToken={resetAmount}
          activeWallet={walletSelected as Wallet}
          t={t}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const openModalWalletList = () => {
    window.openModal({
      type: 'none',
      // title: t('send_from_screen.select_wallet'),
      content: (
        <ListWalletSelect
          walletSelected={walletSelected}
          isHideAddress={false}
          onChangeWalletSelected={handleSetWalletSelected}
          wallets={wallets}
          t={t}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const fiatBalance = formatNumberBro(
    convertWeiToBalance(balanceAvailable, get(tokenSelected, 'decimal')),
    DECIMALS_TOKEN_DISPLAY[get(tokenSelected, 'symbol', '')] || 4
  ).toString()

  const checkLengthInfoToken =
    getLength(fiatBalance) + getLength(get(tokenSelected, 'symbol', '')) >= 16

  const caculateTotal = () => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(amount), 2)
    return { total }
  }
  console.log({ isLoadingGas })
  return isLoadingGas ? (
    <div className="w-full h-full flex items-center justify-center">
      <img
        className={cx('block h-12 w-12 animate-bounce', {})}
        src={`/public/img/brand/${
          isDarkTheme ? 'logo-dark' : 'logo-light'
        }.svg`}
      />
      {/* <Loader width="100px" height="100px" /> */}
    </div>
  ) : (
    <div className="flex w-full h-full flex-col justify-between">
      <div className="pl-4 pr-4 flex flex-col h-full">
        <BoxContent>
          <div
            onClick={openModalWalletList}
            className="flex items-center justify-between border-b-2 border-ui00 py-3 cursor-pointer">
            <div className="flex items-center gap-4 cursor-pointer">
              <WalletAvatar
                walletSelected={walletSelected}
                className="w-10 h-10"
              />
              <div>
                <div
                  className={`text-tiny font-semibold truncate mr-3 text-ui04 ${
                    isExpand ? 'max-w-[200px]' : 'max-w-[140px]'
                  }`}>
                  {get(walletSelected, 'name')}
                </div>

                <div className="text-tiny text-ui03 flex items-center gap-[2px]">
                  {truncate(
                    truncate(get(walletSelected, 'address', ''), { length: 10 })
                  )}
                </div>
              </div>
            </div>
            <Icon
              name="chevron_down"
              className="text-h3 text-ui04 font-semibold"
            />
          </div>
          <div className="pt-3 pb-2">
            <div className="flex items-center justify-between mb-5">
              <div
                className="flex items-center cursor-pointer"
                onClick={onOpenModalTokens('send')}>
                {tokenSelected && (
                  <Image
                    src={get(tokenSelected, 'image', '') || '_'}
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div
                  className={`flex items-center font-semibold ml-2 uppercase text-ui04 whitespace-pre ${
                    checkLengthInfoToken && 'text-[12px]'
                  }`}>
                  {truncateText(get(tokenSelected, 'symbol', ''), 8)}
                </div>

                <Icon
                  name="chevron_down"
                  className="text-tiny ml-2 text-ui04 font-semibold"
                />
              </div>
              <div className="flex">
                <div
                  className={`font-semibold flex items-center text-ui04 truncate ${
                    checkLengthInfoToken && 'text-[12px]'
                  }`}>
                  {isLoading ? (
                    <LoadingCircle />
                  ) : (
                    truncateText(fiatBalance, 12)
                  )}
                </div>
                <span
                  className={`font-semibold ml-1 uppercase text-ui04 ${
                    checkLengthInfoToken && 'text-[12px]'
                  }`}>
                  {truncateText(get(tokenSelected, 'symbol', ''), 8)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Input
                  onChange={onChangeInput}
                  value={amount}
                  className="!placeholder:text-h2 !text-tx-primary font-semibold border-0 outline-none bg-inherit !text-h2 mb-0 !p-0"
                  decimalScale={4}
                  placeholder="0.00"
                  typeInput={TypeInput.Number}
                />
                {/* <span className='text-ui03 text-tiny'>-</span> */}
              </div>
              <div
                onClick={onSelectMaxBalance(
                  get(tokenSelected, 'rawBalance') || '0'
                )}
                className="text-primary mt-1 font-semibold text-tiny uppercase cursor-pointer">
                {t('setting_screen.max')}
              </div>
            </div>
            <div>
              <p className="text-tiny text-ui03">
                {isEmpty(amount) ? '-' : `~$${caculateTotal().total}`}
              </p>
            </div>
          </div>
        </BoxContent>

        {errInput && (
          <div className="text-tiny text-ui03 mt-2 text-center">{errInput}</div>
        )}

        {(!isGasFree || '') && (
          <GasSlider
            chain={chain}
            symbol={'VIC'}
            isCustomGas={isCustomGas}
            isLoading={isLoadingGas}
            gasDecimal={gasDecimal}
            gasStep={gasStep}
            onChange={onChangeGas}
            gasFee={gasFee}
            className="mt-4"
            setIsCustomGas={setIsCustomGas}
            gasLimit={gasLimit}
            t={t}
          />
        )}
        <div className="mt-auto">
          {isGasFree && (
            <div className="body-14-regular text-ui04 text-center mb-4">
              {t('wrap_send.network_gas_free')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SendFrom
