import { useMemo, useEffect } from 'react'
import { convertWeiToBalance, formatNumberBro, cx } from '../../../utils'
import { Button, Icon, ListItem } from '@wallet/ui'
import { useStakingContext } from '../context'
import { useTranslation } from 'react-i18next'
import get from 'lodash/get'
import { onChangeFullScreen, useAppDispatch, useAppSelector } from 'store'
import useRouting from '../../../hooks/useRouting'
import WalletAvatar from '../../shared/WalletAvatar'
import { truncate } from '@wallet/utils'
import round from 'lodash/round'

const DelegatorScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateScreen } = useRouting()

  const {
    totalStaked,
    validatorsDelegator,
    selectedValidator,
    bondedTokens,
    unbondingDelegations,
    setSelectedValidator,
    tokenSelected,
    withdrawList,
    setAmount,
    calculateTotalWithdraw
  } = useStakingContext()

  const [activeWallet] = useAppSelector((state) => [state.wallet.activeWallet])

  const handleClickDetail = (validator: any) => () => {
    setSelectedValidator?.(validator)
    dispatch(onChangeFullScreen(true))
  }

  useEffect(() => {
    setAmount?.('')
  }, [])

  const commission = useMemo(() => {
    return round(
      Number(get(selectedValidator, 'commission_rate', '0.00')) * 100,
      3
    )
  }, [selectedValidator])

  const stakedTotal = useMemo(() => {
    return convertWeiToBalance(get(selectedValidator, 'tokens', 0), 18)
  }, [selectedValidator])

  const votingPower = useMemo(() => {
    return round((stakedTotal / bondedTokens) * 100, 2)
  }, [selectedValidator, stakedTotal])

  const totalWithdraw = useMemo(() => {
    const total = withdrawList?.reduce((acc: any, it: any) => {
      return acc + Number(it.cap)
    }, 0)
    return convertWeiToBalance(total || '0', get(tokenSelected, 'decimal', 18))
  }, [withdrawList])

  const handleClickUnvoteOrWithdraw = () => {
    if (selectedValidator) {
      navigateScreen('/staking', {
        fromScreen: 'delegator-unstake',
        isFullScreen: true
      })()
      return
    }
    navigateScreen('/staking', {
      fromScreen: 'delegator-withdraw',
      isFullScreen: true
    })()
    return
  }

  const handleStake = () => {
    if (selectedValidator) {
      navigateScreen('/staking', {
        fromScreen: 'delegator-stake-selected',
        isFullScreen: true
      })()
    } else {
      navigateScreen('/staking', {
        fromScreen: 'delegator-stake',
        isFullScreen: true
      })()
    }
  }

  const handleWithdraw = () => {
    navigateScreen('/staking', {
      fromScreen: 'delegator-withdraw',
      isFullScreen: true
    })()
  }

  const isDisabled = useMemo(() => {
    const totalReward = calculateTotalWithdraw?.() || 0
    const yourStakeAmount = get(selectedValidator, 'stakeAmount', 0)
    if (selectedValidator && Number(yourStakeAmount) > 0) {
      return !(Number(yourStakeAmount) > 0)
    }
    return !(totalReward > 0)
  }, [selectedValidator, withdrawList])

  const dataReward = get(selectedValidator, 'dataReward', {})
  const owner = get(selectedValidator, 'owner', '')
  const lastestSignedBlock = get(selectedValidator, 'latestSignedBlock', '')
  const capacityNumber = formatNumberBro(
    get(selectedValidator, 'capacityNumber', 0),
    6
  )
  const status = get(selectedValidator, 'status', 'SLASHED')
  const candidate = get(selectedValidator, 'candidate', '')
  const masterNodeROI = get(dataReward, 'mnROI', 0)
  const voterROI = get(dataReward, 'voterROI', 0)
  const url = `https://master.tomochain.com/candidate/${candidate}`

  return (
    <div className="flex flex-col h-full w-full all-center justify-between p-4">
      <div className="flex flex-col h-full w-full justify-start items-start gap-2">
        <div className="flex flex-row w-full items-center justify-between">
          {selectedValidator ? (
            <div className="flex items-center gap-4 cursor-pointer">
              <WalletAvatar
                walletSelected={activeWallet}
                className="w-10 h-10"
              />
              <div>
                <div
                  className={`text-tiny font-semibold truncate mr-3 text-ui04`}>
                  {truncate(get(activeWallet, 'name'), { length: 10 })}
                </div>

                <div className="text-tiny text-ui03 flex items-center gap-[2px]">
                  {truncate(
                    truncate(get(activeWallet, 'address', ''), { length: 10 })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-start items-start">
              <p className="body-12-regular text-tx-secondary">
                {selectedValidator
                  ? t('stake_screen.your_stakes')
                  : t('stake_screen.total_stakes')}
              </p>
              <p className="header-04 text-tx-primary">
                {selectedValidator
                  ? formatNumberBro(
                      get(selectedValidator, 'stakeAmount', '0') || '0',
                      3
                    )
                  : formatNumberBro(totalStaked || '0', 3)}
              </p>
            </div>
          )}
          <div className="flex flex-col justify-start items-start">
            <p className="body-12-regular text-tx-secondary">
              {t('stake_screen.total_rewards')}
            </p>
            <p className="header-04 text-tx-primary self-end">
              {formatNumberBro(totalWithdraw || '0', 3)}
            </p>
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-between gap-4 py-4">
          <Button
            type="custom"
            className="flex-1 px-0 w-full max-h-10 transition-all duration-100 bg-btn-bg-custom border-none"
            outline
            onClick={() => handleStake()}>
            <div className="header-06 flex items-center">
              <Icon className="text-h3 text-btn-icon-custom mr-1" name="add" />{' '}
              {t('stake_screen.vote')}
            </div>
          </Button>
          <Button
            type="custom"
            className={cx(
              'flex-1 px-0 w-full max-h-10 transition-all duration-100 bg-btn-bg-custom border-none',
              { 'bg-btn-bg-disabled-primary': isDisabled }
            )}
            disabled={isDisabled}
            onClick={() => handleClickUnvoteOrWithdraw()}
            outline>
            <div className="header-06 flex items-center">
              <Icon
                className={cx('text-h3 text-btn-icon-custom mr-1', {
                  'text-btn-on-disabled-primary': isDisabled
                })}
                name="chevron_down"
              />{' '}
              {!selectedValidator
                ? t('stake_screen.withdraw')
                : t('stake_screen.unvote')}
            </div>
          </Button>
        </div>
        <p className="header-06 text-tx-secondary">
          {selectedValidator
            ? t('stake_screen.candidate_detail')
            : t('stake_screen.activated_stake')}
        </p>
        <div className="flex h-full w-full flex-col">
          {selectedValidator ? (
            <div className="flex h-full justify-between w-full flex-col">
              <div>
                <div className="flex items-center justify-between py-6 border-b border-ui01">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.owner')}
                  </p>
                  <p className="text-tx-primary body-14-regular">
                    {truncate(owner, { length: 10 })}
                  </p>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-ui01">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.roi')}
                  </p>
                  <p className="text-tx-primary body-14-regular">
                    {round(voterROI, 2)} %
                  </p>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-ui01">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.latest_signed_block')}
                  </p>
                  <p className="text-tx-primary body-14-regular">
                    {lastestSignedBlock}
                  </p>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-ui01">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.status')}
                  </p>
                  <p className="text-tx-primary body-14-regular">{status}</p>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-ui01">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.capacityNumber')}
                  </p>
                  <p className="text-tx-primary body-14-regular">
                    {capacityNumber + ' ' + get(tokenSelected, 'symbol', '')}
                  </p>
                </div>
                <div className="flex items-center justify-between py-6">
                  <p className="text-tx-secondary body-14-regular">
                    {t('stake_screen.website')}
                  </p>
                  <a
                    className="text-brand-highlight body-14-regular"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {t('stake_screen.link')}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {validatorsDelegator &&
                validatorsDelegator?.map((validator: any, index: number) => {
                  const validatorName = get(validator, 'name', '')
                  const amount =
                    formatNumberBro(get(validator, 'stakeAmount', 0), 2) +
                    ' ' +
                    get(tokenSelected, 'symbol', '')
                  const isLastItem = index === validatorsDelegator?.length - 1
                  return (
                    <ListItem
                      key={get(validator, 'name', index) + index}
                      title={validatorName}
                      description={amount}
                      onClick={handleClickDetail?.(validator)}
                      showArrow
                      iconClassName="text-icon-primary"
                      className={cx('p-0 w-full', {
                        'border-b-[1px] border-divider': !isLastItem
                      })}
                      hideImage
                      icon="validator"
                    />
                  )
                })}
              {unbondingDelegations && unbondingDelegations?.length > 0 && (
                <p className="header-06 text-tx-secondary">
                  {t('stake_screen.pending_unstakes')}
                </p>
              )}
              {unbondingDelegations?.map((delegator: any, index: number) => {
                const validatorName = get(delegator, 'name', '')
                const unvoteAmount = convertWeiToBalance(
                  get(delegator, 'capacity', 0),
                  get(tokenSelected, 'decimal', '')
                )
                const amount =
                  formatNumberBro(unvoteAmount, 4) +
                  ' ' +
                  get(tokenSelected, 'symbol', '')
                const createdAt = new Date(get(delegator, 'createdAt', ''))
                // get remaining time by 48 hours - (current time - createdAt)
                const remainingTime =
                  48 - (Date.now() - createdAt.getTime()) / 1000 / 60 / 60
                const formatRemainingTime = formatNumberBro(remainingTime, 2)
                const isLastItem = index === unbondingDelegations?.length - 1
                return (
                  <ListItem
                    key={get(delegator, 'validator.operator_address', index)}
                    title={validatorName}
                    description={
                      <p className="body-14-regular text-tx-secondary">
                        {amount + ' | ' + formatRemainingTime + ' hours left'}
                      </p>
                    }
                    iconClassName="text-icon-primary"
                    className={cx('p-0 w-full', {
                      'border-b-[1px] border-divider': !isLastItem
                    })}
                    hideImage
                    icon="validator"
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DelegatorScreen
