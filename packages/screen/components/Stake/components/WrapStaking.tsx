import React, { useState, useEffect, useMemo } from 'react'
import { MainLayout, Button, Icon, Image, ListItem } from '@wallet/ui'
import { useTranslation } from 'react-i18next'
import useTheme from '../../../hooks/useTheme'
import StakeIntroScreen from './StakeIntroScreen'
import { useStakingContext } from '../context'
import ValidatorSelectionScreen from './ValidatorSelectionScreen'
import { STAKE_STEP, SORT_TYPE } from '../../../types'
import useRouting from '../../../hooks/useRouting'
import { checkCurrentStep } from '../utils'
import StakeReview from './StakeReview'
import StakeConfirm from './StakeConfirm'
import { convertBalanceToWei, convertWeiToBalance } from '../../../utils'
import get from 'lodash/get'
import { CHAIN_DATA } from '@wallet/constants'
import { useAppDispatch, useAppSelector, onChangeFullScreen } from 'store'
import cn from 'classnames'
import DelegatorScreen from './DelegatorScreen'
import { useLocation } from 'react-router-dom'
import WithdrawReview from './WithdrawReview'
import ValidatorSort from './ValidatorSort'
import { MINIMUM_AMOUNT_STAKE } from '../../../constants'

type ButtonType = {
  isDisabled: boolean
  text?: string
  message?: string
}

interface LocationState {
  fromScreen?: string
  onBack?: () => void
  isFullScreen?: boolean
}

const WrapStake = () => {
  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const { navigateScreen } = useRouting()
  const [mainBalance, setMainBalance] = useState('0')

  const [activeWallet, activeNetwork] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.setting.activeNetwork
  ])

  const dispatch = useAppDispatch()

  const { state = {} as LocationState } = useLocation<LocationState>()
  const fromScreen = get(state, 'fromScreen', '')
  const onBack = get(state, 'onBack', null)
  const isFullScreen = get(state, 'isFullScreen', false)

  const isFromValidatorSelected = fromScreen === 'delegator-stake-selected'
  const isFromValidatorList = fromScreen === 'delegator-stake'
  const isFromUnstake = fromScreen === 'delegator-unstake'
  const isFromDelegatorWithdraw = fromScreen === 'delegator-withdraw'
  const isFromValidatorsSelect = fromScreen === 'validator-select'

  const [isValidatorSelected, setIsValidatorSelected] = useState(false)
  // this is used for the sort run 1 time
  const [isSorted, setIsSorted] = useState(false)

  const [isWithdrawRemain, setIsWithdrawRemain] = useState(false)

  const {
    isStaking,
    currentStep,
    isLoading,
    tokenSelected,
    amount,
    gasFee,
    gasDecimal,
    mainToken,
    isDelegations,
    validatorList,
    selectedValidator,
    isUnstake,
    isWithdraw,
    currentSort,
    unbondingDelegations,
    setIsWithdraw,
    setIsUnstake,
    setCurrentStep,
    fetchValidatorList,
    fetchStakingToken,
    fetchWidthdrawList,
    fetchDelegators,
    setSelectedValidator,
    setIsLoading,
    handleSort,
    fetchUnbondingDelegations,
    calculateTotalWithdraw,
    withdrawList
  } = useStakingContext()

  const isCheckNotEnoughTxsFee =
    Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
    Number(mainBalance)

  useEffect(() => {
    const mainBalanceRaw = get(mainToken, 'rawBalance', '0')
    setMainBalance(mainBalanceRaw)
  }, [mainToken])

  useEffect(() => {
    const totalReward = calculateTotalWithdraw?.() || 0
    setIsWithdrawRemain(totalReward > 0)
  }, [withdrawList])

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading?.(true)
        await fetchValidatorList?.()
        await fetchWidthdrawList?.()
        await fetchStakingToken?.()
        await fetchUnbondingDelegations?.()
        // after fetch theese datas, it took a few more milisecs to call useMemo isDelegations
        await setTimeout(() => {setIsLoading?.(false)}, 250) // so I give it more time
      } catch (error) {
        console.log('error', error)
        setIsLoading?.(false)
      }
    })()

    return () => {
      setIsUnstake?.(false)
    }
  }, [])

  useEffect(() => {
    if (validatorList.length === 0) return
    if (isSorted) return
    handleSort?.(currentSort || SORT_TYPE.AMOUNT_STAKED)
    setIsSorted(true)
    ;(async () => {
      try {
        setIsLoading?.(true)
        await fetchDelegators?.()

      } catch (error) {
        console.log('error', error)
      } finally {
        // done loading in the useffect above (not here)
        // setIsLoading?.(false)
      }
    })()
  }, [JSON.stringify(validatorList)])

  useEffect(() => {
    ;(async () => {
      await fetchStakingToken?.()
    })()
  }, [currentStep])

  useEffect(() => {
    if (selectedValidator) {
      setIsValidatorSelected(true)
    } else {
      setIsValidatorSelected(false)
      dispatch(onChangeFullScreen(false))
    }
  }, [selectedValidator])

  useEffect(() => {
    dispatch(onChangeFullScreen(isFullScreen))
    if (isFromUnstake) {
      setIsUnstake?.(true)
      setCurrentStep?.(STAKE_STEP.Review)
    } else if (isFromValidatorSelected) {
      setCurrentStep?.(STAKE_STEP.Review)
    } else if (isFromValidatorList) {
      setCurrentStep?.(STAKE_STEP.Select)
    } else if (isFromDelegatorWithdraw) {
      setIsWithdraw?.(true)
    }
  }, [isFullScreen, fromScreen])

  const renderTitle = useMemo(() => {
    const objTitle = {
      [STAKE_STEP.Select]: t('stake_screen.select_validator'),
      [STAKE_STEP.Review]: isUnstake
        ? t('stake_screen.unvote')
        : t('stake_screen.vote'),
      [STAKE_STEP.Confirm]: isUnstake
        ? t('stake_screen.unstake_confirm')
        : t('stake_screen.stake_confirm')
    }
    return objTitle[currentStep]
  }, [currentStep, isUnstake])

  const renderStateButton: ButtonType = useMemo(() => {
    const decimal = get(tokenSelected, 'decimal', 18)
    const balanceRaw = get(tokenSelected, 'rawBalance', '0')
    const amountRaw = convertBalanceToWei(amount, decimal)
    const feeTxsRaw = convertBalanceToWei('0', decimal)
    const balanceAvailable = parseFloat(balanceRaw) - parseFloat(feeTxsRaw)
    const stakeAmount = get(selectedValidator, 'stakeAmount', '0')
    const errorMinimumStake = (!isWithdraw && !isUnstake) && Number(parseFloat(amount)) < MINIMUM_AMOUNT_STAKE

    const isNotEnoughBalance = isUnstake
      ? Number(parseFloat(amount)) - Number(stakeAmount) > 0
      : Number(parseFloat(amountRaw)) - balanceAvailable > 0

    const isNotEnoughTxsFee =
      Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
      Number(mainBalance)

    // for screen send from
    if (isNotEnoughTxsFee) {
      return { isDisabled: true, text: t('wrap_send.not_enough_txs_fee') }
    }


    if (parseFloat(amountRaw) <= 0) {
      const err: any = { isDisabled: true, text: t('wrap_send.enter_amount') }
      return err
    }
    if (errorMinimumStake) {
      return {
        isDisabled: true,
        text: t('stake_screen.min_amount_stake', {amount: MINIMUM_AMOUNT_STAKE}),
        message: t('stake_screen.min_amount_stake', {amount: MINIMUM_AMOUNT_STAKE})
      }
    }

    if (isNotEnoughBalance) {
      return {
        isDisabled: true,
        text: t('wrap_send.insufficient_fund'),
        message: isUnstake ? t('stake_screen.insufficient_fund') : t('wrap_send.not_enough_balance', {
          symbol: get(tokenSelected, 'symbol', '').toLocaleUpperCase()
        })
      }
    }

    if (checkCurrentStep(currentStep, STAKE_STEP.Select)) {
      return { isDisabled: false }
    }

    return { isDisabled: false }
  }, [amount, currentStep, mainBalance])

  const handleDirectInpage = (type?: string) => {
    if (type === 'back') {
      if (checkCurrentStep(currentStep, STAKE_STEP.Select)) {
        setSelectedValidator?.(null)
        navigateScreen('/staking', {
          fromScreen: '',
          isFullScreen: false
        })()
        return
      }

      if (checkCurrentStep(currentStep, STAKE_STEP.Review)) {
        if (isFromUnstake) {
          setIsUnstake?.(false)
          navigateScreen('/staking', {
            fromScreen: '',
            isFullScreen: true
          })()
        } else if (isFromValidatorSelected) {
          navigateScreen('/staking', {
            fromScreen: '',
            isFullScreen: true
          })()
        } else {
          setCurrentStep?.(STAKE_STEP.Select)
        }
      }

      if (checkCurrentStep(currentStep, STAKE_STEP.Confirm)) {
        setCurrentStep?.(STAKE_STEP.Review)
      }
    } else {
      if (checkCurrentStep(currentStep, STAKE_STEP.Select)) {
        setCurrentStep?.(STAKE_STEP.Review)
      }

      if (checkCurrentStep(currentStep, STAKE_STEP.Review)) {
        setCurrentStep?.(STAKE_STEP.Confirm)
      }
    }
  }

  const renderStakeScreen = () => {
    if (checkCurrentStep(currentStep, STAKE_STEP.Select)) {
      return <ValidatorSelectionScreen />
    }

    if (checkCurrentStep(currentStep, STAKE_STEP.Review)) {
      return <StakeReview errInput={renderStateButton.message} />
    }
    return <StakeConfirm mainBalance={mainBalance} />
  }

  if (isLoading && !checkCurrentStep(currentStep, STAKE_STEP.Review)) {
    return (
      <MainLayout
        title={t('stake_screen.stake')}
        hideBack
        stylesContent={{ marginBottom: 0 }}>
        <div className="flex flex-col h-full w-full all-center p-4">
          {/* <Loader width="200px" height="200px" /> */}
          <img
            className={cn('h-20 w-20 animate-bounce', {})}
            src={`/public/img/brand/${
              isDarkTheme ? 'logo-dark' : 'logo-light'
            }.svg`}
          />
        </div>
      </MainLayout>
    )
  }

  if (!isDelegations && !isWithdrawRemain && fromScreen !== 'stake-intro' && !selectedValidator) {
    return <StakeIntroScreen />
  }

  const handleBackDelegator = () => {
    if (isValidatorSelected) {
      setSelectedValidator?.(null)
      navigateScreen('/staking', {
        isFullScreen: false
      })()
    }
  }

  const openSortingModal = () => {
    window.openModal({
      type: 'none',
      title: '',
      content: (
        <ValidatorSort currentSort={currentSort} handleSort={handleSort} />
      ),
      contentType: 'other',
      closable: true,
      onCancel: () => {
        window.closeModal()
      }
    })
  }

  return !isFromValidatorsSelect &&
    (isDelegations || isWithdrawRemain) &&
    (fromScreen === '' || isFromDelegatorWithdraw) ? (
    <MainLayout
      title={
        isWithdraw
          ? t('stake_screen.withdraw_confirm')
          : isValidatorSelected
          ? get(selectedValidator, 'name', 'Validator')
          : t('stake_screen.stake')
      }
      hideBack={!isValidatorSelected || isWithdraw}
      stylesContent={{ marginBottom: 0 }}
      backAction={() => handleBackDelegator()}
      right={
        isWithdraw ? (
          <Icon
            name="close"
            className="cursor-pointer text-icon-primary icon"
            onClick={() => {
              setIsWithdraw?.(false)
              navigateScreen('/staking', {
                fromScreen: '',
                isFullScreen: false
              })()
            }}
          />
        ) : isValidatorSelected ? (
          <Image
            src={get(selectedValidator, 'imageURL', '')}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <Image
            src={get(CHAIN_DATA[activeNetwork?.chain || 'inj'], 'logo')}
            className="w-8 h-8 rounded-full"
          />
        )
      }>
      {isWithdraw && <WithdrawReview />}
      {!isWithdraw && <DelegatorScreen />}
    </MainLayout>
  ) : (
    (fromScreen === 'stake-intro' ||
      fromScreen.includes('delegator') ||
      isFromValidatorsSelect) && (
      <MainLayout
        title={renderTitle}
        hideBack={isStaking}
        containerClass="relative"
        className="pb-5"
        stakeStep={currentStep}
        backAction={() => handleDirectInpage('back')}
        right={
          checkCurrentStep(currentStep, STAKE_STEP.Select) && (
            <Icon
              name="filter"
              className="cursor-pointer text-icon-primary icon"
              onClick={openSortingModal}
            />
          )
        }>
        {/* {!isUserStaked && <StakeIntroScreen />} */}
        {renderStakeScreen()}

        {currentStep !== 'select' && currentStep !== 'confirm' && (
          <div className="mt-auto bottom-6 pl-4 pr-4 w-full">
            {isCheckNotEnoughTxsFee && (
              <div className="text-center mb-4 text-tiny text-icon-secondary">
                {t('wrap_send.not_enough_txs_fee', {
                  unit: get(mainToken, 'symbol', 'vic')
                })}
              </div>
            )}
            <Button
              isBlock
              isLoading={isLoading}
              disabled={renderStateButton.isDisabled || isCheckNotEnoughTxsFee}
              onClick={() => handleDirectInpage()}
              // onClick={() => handleTransfer?.(false, gasLimit)}
            >
              {currentStep === STAKE_STEP.Review
                ? t('stake_screen.review')
                : t('stake_screen.confirm')}
            </Button>
          </div>
        )}
      </MainLayout>
    )
  )
}

export default WrapStake
